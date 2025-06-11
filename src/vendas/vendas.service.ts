import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  async create(createVendaDto: CreateVendaDto, usuarioId: number) {
    // Verificar se o produto existe e pertence ao usuário
    const produto = await this.prisma.produto.findFirst({
      where: {
        id: createVendaDto.produtoId,
        usuarioId,
        ativo: true,
      },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado ou inativo');
    }

    // Calcular valores
    const valorUnit = Number(produto.preco);
    const valorTotal = valorUnit * createVendaDto.quantidade;

    return this.prisma.venda.create({
      data: {
        ...createVendaDto,
        dataVenda: new Date(createVendaDto.dataVenda),
        valorUnit,
        valorTotal,
        usuarioId,
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            categoria: true,
          },
        },
      },
    });
  }

  async findAll(
    usuarioId: number,
    paginationDto: PaginationDto,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = paginationDto;

    const whereClause: any = { usuarioId };

    if (dataInicio || dataFim) {
      whereClause.dataVenda = {};
      if (dataInicio) {
        whereClause.dataVenda.gte = new Date(dataInicio);
      }
      if (dataFim) {
        whereClause.dataVenda.lte = new Date(dataFim);
      }
    }

    const [vendas, total] = await Promise.all([
      this.prisma.venda.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { dataVenda: 'desc' },
        include: {
          produto: {
            select: {
              id: true,
              nome: true,
              categoria: true,
            },
          },
        },
      }),
      this.prisma.venda.count({
        where: whereClause,
      }),
    ]);

    return {
      data: vendas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, usuarioId: number) {
    const venda = await this.prisma.venda.findFirst({
      where: { id, usuarioId },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            categoria: true,
          },
        },
      },
    });

    if (!venda) {
      throw new NotFoundException('Venda não encontrada');
    }

    return venda;
  }

  async update(id: number, updateVendaDto: UpdateVendaDto, usuarioId: number) {
    const venda = await this.findOne(id, usuarioId);

    const updateData: any = { ...updateVendaDto };

    if (updateVendaDto.dataVenda) {
      updateData.dataVenda = new Date(updateVendaDto.dataVenda);
    }

    // Recalcular valor total se quantidade mudou
    if (updateVendaDto.quantidade) {
      const produto = await this.prisma.produto.findUnique({
        where: { id: venda.produtoId },
      });
      updateData.valorTotal = Number(produto.preco) * updateVendaDto.quantidade;
    }

    return this.prisma.venda.update({
      where: { id },
      data: updateData,
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            categoria: true,
          },
        },
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.venda.delete({
      where: { id },
      select: {
        id: true,
        quantidade: true,
        valorTotal: true,
        dataVenda: true,
        produto: {
          select: {
            nome: true,
          },
        },
      },
    });
  }

  async getVendasPorPeriodo(
    usuarioId: number,
    dataInicio: string,
    dataFim: string,
  ) {
    const vendas = await this.prisma.venda.findMany({
      where: {
        usuarioId,
        dataVenda: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      },
      include: {
        produto: {
          select: {
            nome: true,
            categoria: true,
          },
        },
      },
      orderBy: { dataVenda: 'desc' },
    });

    const totalVendas = vendas.reduce((sum, venda) => sum + Number(venda.valorTotal), 0);
    const quantidadeVendas = vendas.length;

    return {
      vendas,
      resumo: {
        totalVendas,
        quantidadeVendas,
        ticketMedio: quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0,
      },
    };
  }

  async getResumoMensal(usuarioId: number, mes: number, ano: number) {
    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = new Date(ano, mes, 0, 23, 59, 59);

    const vendas = await this.prisma.venda.findMany({
      where: {
        usuarioId,
        dataVenda: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        produto: {
          select: {
            nome: true,
            categoria: true,
          },
        },
      },
    });

    const totalVendas = vendas.reduce((sum, venda) => sum + Number(venda.valorTotal), 0);
    const quantidadeVendas = vendas.length;

    // Produto mais vendido
    const produtoCount = vendas.reduce((acc, venda) => {
      const produtoNome = venda.produto.nome;
      acc[produtoNome] = (acc[produtoNome] || 0) + venda.quantidade;
      return acc;
    }, {});

    const produtoMaisVendido = Object.keys(produtoCount).reduce((a, b) =>
      produtoCount[a] > produtoCount[b] ? a : b,
    );

    // Vendas por categoria
    const vendasPorCategoria = vendas.reduce((acc, venda) => {
      const categoria = venda.produto.categoria || 'Sem categoria';
      acc[categoria] = (acc[categoria] || 0) + Number(venda.valorTotal);
      return acc;
    }, {});

    return {
      mes,
      ano,
      totalVendas,
      quantidadeVendas,
      produtoMaisVendido,
      vendasPorCategoria,
      ticketMedio: quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0,
    };
  }
} 