import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException, ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto, usuarioId: number) {
    return this.prisma.produto.create({
      data: {
        ...createProdutoDto,
        usuarioId,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(
    usuarioId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<any>> {
    const { page, limit, skip } = paginationDto;

    const [produtos, total] = await Promise.all([
      this.prisma.produto.findMany({
        where: { usuarioId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { vendas: true },
          },
        },
      }),
      this.prisma.produto.count({
        where: { usuarioId },
      }),
    ]);

    return {
      data: produtos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, usuarioId: number) {
    const produto = await this.prisma.produto.findFirst({
      where: { id, usuarioId },
      include: {
        _count: {
          select: { vendas: true },
        },
        vendas: {
          take: 5,
          orderBy: { dataVenda: 'desc' },
          select: {
            id: true,
            quantidade: true,
            valorTotal: true,
            dataVenda: true,
          },
        },
      },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto, usuarioId: number) {
    const produto = await this.prisma.produto.findFirst({
      where: { id, usuarioId },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    const produto = await this.prisma.produto.findFirst({
      where: { id, usuarioId },
      include: {
        _count: {
          select: { vendas: true },
        },
      },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (produto._count.vendas > 0) {
      throw new ForbiddenException(
        'Não é possível excluir produto que possui vendas associadas',
      );
    }

    return this.prisma.produto.delete({
      where: { id },
      select: {
        id: true,
        nome: true,
        preco: true,
      },
    });
  }

  async findByCategory(categoria: string, usuarioId: number) {
    return this.prisma.produto.findMany({
      where: {
        usuarioId,
        categoria,
        ativo: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async getMostSold(usuarioId: number, limit: number = 10) {
    const produtos = await this.prisma.produto.findMany({
      where: { usuarioId },
      include: {
        vendas: {
          select: {
            quantidade: true,
          },
        },
      },
    });

    return produtos
      .map((produto) => ({
        ...produto,
        totalVendido: produto.vendas.reduce(
          (sum, venda) => sum + venda.quantidade,
          0,
        ),
      }))
      .sort((a, b) => b.totalVendido - a.totalVendido)
      .slice(0, limit);
  }
} 