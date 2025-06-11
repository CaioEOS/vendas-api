import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(usuarioId: number) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    const fimAno = new Date(hoje.getFullYear(), 11, 31);

    // Vendas do mês atual
    const vendasMes = await this.prisma.venda.findMany({
      where: {
        usuarioId,
        dataVenda: {
          gte: inicioMes,
          lte: fimMes,
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

    // Vendas do ano atual
    const vendasAno = await this.prisma.venda.findMany({
      where: {
        usuarioId,
        dataVenda: {
          gte: inicioAno,
          lte: fimAno,
        },
      },
    });

    // Produtos mais vendidos
    const produtosMaisVendidos = await this.prisma.venda.groupBy({
      by: ['produtoId'],
      where: {
        usuarioId,
        dataVenda: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
      _sum: {
        quantidade: true,
        valorTotal: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
      take: 5,
    });

    // Buscar detalhes dos produtos
    const produtosDetalhes = await Promise.all(
      produtosMaisVendidos.map(async (item) => {
        const produto = await this.prisma.produto.findUnique({
          where: { id: item.produtoId },
          select: { nome: true, categoria: true },
        });
        return {
          produto,
          quantidadeVendida: item._sum.quantidade,
          valorTotal: item._sum.valorTotal,
        };
      }),
    );

    // Vendas por categoria
    const vendasPorCategoria = vendasMes.reduce((acc, venda) => {
      const categoria = venda.produto.categoria || 'Sem categoria';
      if (!acc[categoria]) {
        acc[categoria] = {
          quantidade: 0,
          valor: 0,
        };
      }
      acc[categoria].quantidade += venda.quantidade;
      acc[categoria].valor += Number(venda.valorTotal);
      return acc;
    }, {});

    // Vendas por dia do mês
    const vendasPorDia = vendasMes.reduce((acc, venda) => {
      const dia = venda.dataVenda.getDate();
      if (!acc[dia]) {
        acc[dia] = 0;
      }
      acc[dia] += Number(venda.valorTotal);
      return acc;
    }, {});

    // Totais
    const totalVendasMes = vendasMes.reduce(
      (sum, venda) => sum + Number(venda.valorTotal),
      0,
    );
    const totalVendasAno = vendasAno.reduce(
      (sum, venda) => sum + Number(venda.valorTotal),
      0,
    );
    const quantidadeVendasMes = vendasMes.length;
    const quantidadeVendasAno = vendasAno.length;

    return {
      resumoMensal: {
        totalVendas: totalVendasMes,
        quantidadeVendas: quantidadeVendasMes,
        ticketMedio:
          quantidadeVendasMes > 0 ? totalVendasMes / quantidadeVendasMes : 0,
      },
      resumoAnual: {
        totalVendas: totalVendasAno,
        quantidadeVendas: quantidadeVendasAno,
        ticketMedio:
          quantidadeVendasAno > 0 ? totalVendasAno / quantidadeVendasAno : 0,
      },
      produtosMaisVendidos: produtosDetalhes,
      vendasPorCategoria,
      vendasPorDia,
    };
  }

  async getComparativoMensal(usuarioId: number, ano: number) {
    const comparativo = [];

    for (let mes = 1; mes <= 12; mes++) {
      const inicioMes = new Date(ano, mes - 1, 1);
      const fimMes = new Date(ano, mes, 0);

      const vendas = await this.prisma.venda.findMany({
        where: {
          usuarioId,
          dataVenda: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
      });

      const totalVendas = vendas.reduce(
        (sum, venda) => sum + Number(venda.valorTotal),
        0,
      );

      comparativo.push({
        mes,
        nomeMes: new Date(ano, mes - 1).toLocaleString('pt-BR', {
          month: 'long',
        }),
        totalVendas,
        quantidadeVendas: vendas.length,
        ticketMedio: vendas.length > 0 ? totalVendas / vendas.length : 0,
      });
    }

    return comparativo;
  }

  async getRelatorioDetalhado(
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
            preco: true,
          },
        },
      },
      orderBy: {
        dataVenda: 'desc',
      },
    });

    const totalVendas = vendas.reduce(
      (sum, venda) => sum + Number(venda.valorTotal),
      0,
    );
    const quantidadeVendas = vendas.length;

    // Análise por produto
    const analisePorProduto = vendas.reduce((acc, venda) => {
      const produtoNome = venda.produto.nome;
      if (!acc[produtoNome]) {
        acc[produtoNome] = {
          quantidade: 0,
          valorTotal: 0,
          categoria: venda.produto.categoria,
          precoUnitario: Number(venda.produto.preco),
        };
      }
      acc[produtoNome].quantidade += venda.quantidade;
      acc[produtoNome].valorTotal += Number(venda.valorTotal);
      return acc;
    }, {});

    // Análise por categoria
    const analisePorCategoria = vendas.reduce((acc, venda) => {
      const categoria = venda.produto.categoria || 'Sem categoria';
      if (!acc[categoria]) {
        acc[categoria] = {
          quantidade: 0,
          valorTotal: 0,
          produtos: new Set(),
        };
      }
      acc[categoria].quantidade += venda.quantidade;
      acc[categoria].valorTotal += Number(venda.valorTotal);
      acc[categoria].produtos.add(venda.produto.nome);
      return acc;
    }, {});

    // Converter Set para Array
    Object.keys(analisePorCategoria).forEach((categoria) => {
      analisePorCategoria[categoria].produtos = Array.from(
        analisePorCategoria[categoria].produtos,
      );
    });

    return {
      periodo: {
        dataInicio,
        dataFim,
      },
      resumo: {
        totalVendas,
        quantidadeVendas,
        ticketMedio: quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0,
      },
      vendas,
      analisePorProduto,
      analisePorCategoria,
    };
  }

  async exportarDados(usuarioId: number, formato: 'json' | 'csv' = 'json') {
    const vendas = await this.prisma.venda.findMany({
      where: { usuarioId },
      include: {
        produto: {
          select: {
            nome: true,
            categoria: true,
            preco: true,
          },
        },
      },
      orderBy: {
        dataVenda: 'desc',
      },
    });

    if (formato === 'csv') {
      const csvHeader = [
        'Data',
        'Produto',
        'Categoria',
        'Quantidade',
        'Valor Unitário',
        'Valor Total',
        'Observações',
      ].join(',');

      const csvData = vendas
        .map((venda) => [
          venda.dataVenda.toISOString().split('T')[0],
          `"${venda.produto.nome}"`,
          `"${venda.produto.categoria || ''}"`,
          venda.quantidade,
          Number(venda.valorUnit).toFixed(2),
          Number(venda.valorTotal).toFixed(2),
          `"${venda.observacoes || ''}"`,
        ])
        .map((row) => row.join(','))
        .join('\n');

      return `${csvHeader}\n${csvData}`;
    }

    return vendas;
  }
} 