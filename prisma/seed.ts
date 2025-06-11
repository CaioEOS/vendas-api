import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.venda.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.relatorioMensal.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🗑️ Dados existentes removidos');

  // Criar usuários
  const senhaHash = await bcrypt.hash('123456', 10);

  const maria = await prisma.usuario.create({
    data: {
      nome: 'Maria Silva',
      email: 'maria@mei.com',
      senha: senhaHash,
    },
  });

  const joao = await prisma.usuario.create({
    data: {
      nome: 'João Santos',
      email: 'joao@mei.com',
      senha: senhaHash,
    },
  });

  console.log('👥 Usuários criados');

  // Produtos para Maria (Loja de Eletrônicos e Acessórios)
  const produtosMaria = await Promise.all([
    // Eletrônicos
    prisma.produto.create({
      data: {
        nome: 'Smartphone Samsung Galaxy A54',
        descricao: 'Smartphone com 128GB, câmera tripla 50MP, tela 6.4"',
        preco: 1299.99,
        categoria: 'Eletrônicos',
        usuarioId: maria.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Fone de Ouvido Bluetooth JBL',
        descricao: 'Fone sem fio com cancelamento de ruído, bateria 20h',
        preco: 299.9,
        categoria: 'Eletrônicos',
        usuarioId: maria.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Carregador Portátil 10000mAh',
        descricao: 'Power bank com entrada USB-C e wireless',
        preco: 89.9,
        categoria: 'Acessórios',
        usuarioId: maria.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Cabo USB-C 2 metros',
        descricao: 'Cabo reforçado para carregamento rápido',
        preco: 25.9,
        categoria: 'Acessórios',
        usuarioId: maria.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Película de Vidro Temperado',
        descricao: 'Proteção 9H para tela de smartphone',
        preco: 15.9,
        categoria: 'Acessórios',
        usuarioId: maria.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Capa Silicone Transparente',
        descricao: 'Proteção flexível e resistente',
        preco: 19.9,
        categoria: 'Acessórios',
        usuarioId: maria.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Smartwatch Xiaomi Band 8',
        descricao: 'Monitor de atividades com GPS e frequência cardíaca',
        preco: 199.9,
        categoria: 'Eletrônicos',
        usuarioId: maria.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Suporte Veicular Magnético',
        descricao: 'Suporte para celular com fixação magnética',
        preco: 35.9,
        categoria: 'Acessórios',
        usuarioId: maria.id,
      },
    }),
  ]);

  // Produtos para João (Loja de Roupas e Calçados)
  const produtosJoao = await Promise.all([
    prisma.produto.create({
      data: {
        nome: 'Camiseta Básica Algodão',
        descricao: 'Camiseta 100% algodão, várias cores disponíveis',
        preco: 29.9,
        categoria: 'Roupas',
        usuarioId: joao.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Calça Jeans Masculina',
        descricao: 'Calça jeans slim fit, lavagem escura',
        preco: 89.9,
        categoria: 'Roupas',
        usuarioId: joao.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Tênis Esportivo Nike',
        descricao: 'Tênis para corrida com tecnologia Air',
        preco: 299.9,
        categoria: 'Calçados',
        usuarioId: joao.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Vestido Floral Feminino',
        descricao: 'Vestido midi com estampa floral, tecido leve',
        preco: 79.9,
        categoria: 'Roupas',
        usuarioId: joao.id,
      },
    }),
  ]);

  console.log('📦 Produtos criados');

  // Gerar vendas dos últimos 6 meses para Maria
  const hoje = new Date();
  const vendas = [];

  for (let mes = 0; mes < 6; mes++) {
    const dataBase = new Date(hoje.getFullYear(), hoje.getMonth() - mes, 1);
    const diasNoMes = new Date(dataBase.getFullYear(), dataBase.getMonth() + 1, 0).getDate();
    
    // Gerar entre 15-30 vendas por mês
    const numVendas = Math.floor(Math.random() * 16) + 15;
    
    for (let i = 0; i < numVendas; i++) {
      const diaVenda = Math.floor(Math.random() * diasNoMes) + 1;
      const dataVenda = new Date(dataBase.getFullYear(), dataBase.getMonth(), diaVenda);
      
      // Selecionar produto aleatório
      const produto = produtosMaria[Math.floor(Math.random() * produtosMaria.length)];
      const quantidade = Math.floor(Math.random() * 3) + 1; // 1-3 unidades
      const valorTotal = produto.preco.toNumber() * quantidade;
      
      vendas.push({
        produtoId: produto.id,
        quantidade,
        valorUnit: produto.preco,
        valorTotal,
        dataVenda,
        observacoes: Math.random() > 0.7 ? 'Venda realizada via WhatsApp' : null,
        usuarioId: maria.id,
      });
    }
  }

  // Gerar algumas vendas para João também
  for (let mes = 0; mes < 3; mes++) {
    const dataBase = new Date(hoje.getFullYear(), hoje.getMonth() - mes, 1);
    const diasNoMes = new Date(dataBase.getFullYear(), dataBase.getMonth() + 1, 0).getDate();
    
    const numVendas = Math.floor(Math.random() * 10) + 8; // 8-17 vendas
    
    for (let i = 0; i < numVendas; i++) {
      const diaVenda = Math.floor(Math.random() * diasNoMes) + 1;
      const dataVenda = new Date(dataBase.getFullYear(), dataBase.getMonth(), diaVenda);
      
      const produto = produtosJoao[Math.floor(Math.random() * produtosJoao.length)];
      const quantidade = Math.floor(Math.random() * 2) + 1; // 1-2 unidades
      const valorTotal = produto.preco.toNumber() * quantidade;
      
      vendas.push({
        produtoId: produto.id,
        quantidade,
        valorUnit: produto.preco,
        valorTotal,
        dataVenda,
        observacoes: Math.random() > 0.8 ? 'Cliente fidelizado' : null,
        usuarioId: joao.id,
      });
    }
  }

  // Inserir vendas em lotes
  await prisma.venda.createMany({
    data: vendas,
  });

  console.log(`💰 ${vendas.length} vendas criadas`);

  // Criar alguns relatórios mensais
  const relatorios = [];
  
  for (let mes = 1; mes <= 6; mes++) {
    const ano = 2025;
    
    // Relatório para Maria
    const vendasMariaMes = vendas.filter(v => 
      v.usuarioId === maria.id && 
      new Date(v.dataVenda).getMonth() === (hoje.getMonth() - mes + 1) &&
      new Date(v.dataVenda).getFullYear() === ano
    );
    
    if (vendasMariaMes.length > 0) {
      const totalVendas = vendasMariaMes.reduce((sum, v) => sum + v.valorTotal, 0);
      const quantidadeVendas = vendasMariaMes.length;
      
      relatorios.push({
        usuarioId: maria.id,
        mes: hoje.getMonth() - mes + 1,
        ano,
        totalVendas,
        quantidadeVendas,
        produtoMaisVendido: 'Smartphone Samsung Galaxy A54',
      });
    }
    
    // Relatório para João
    const vendasJoaoMes = vendas.filter(v => 
      v.usuarioId === joao.id && 
      new Date(v.dataVenda).getMonth() === (hoje.getMonth() - mes + 1) &&
      new Date(v.dataVenda).getFullYear() === ano
    );
    
    if (vendasJoaoMes.length > 0) {
      const totalVendas = vendasJoaoMes.reduce((sum, v) => sum + v.valorTotal, 0);
      const quantidadeVendas = vendasJoaoMes.length;
      
      relatorios.push({
        usuarioId: joao.id,
        mes: hoje.getMonth() - mes + 1,
        ano,
        totalVendas,
        quantidadeVendas,
        produtoMaisVendido: 'Tênis Esportivo Nike',
      });
    }
  }

  if (relatorios.length > 0) {
    await prisma.relatorioMensal.createMany({
      data: relatorios,
    });
  }

  console.log(`📊 ${relatorios.length} relatórios mensais criados`);

  // Estatísticas finais
  const totalUsuarios = await prisma.usuario.count();
  const totalProdutos = await prisma.produto.count();
  const totalVendas = await prisma.venda.count();
  const valorTotalVendas = await prisma.venda.aggregate({
    _sum: {
      valorTotal: true,
    },
  });

  console.log('\n📈 Estatísticas do Seed:');
  console.log(`👥 Usuários: ${totalUsuarios}`);
  console.log(`📦 Produtos: ${totalProdutos}`);
  console.log(`💰 Vendas: ${totalVendas}`);
  console.log(`💵 Valor Total: R$ ${valorTotalVendas._sum.valorTotal?.toFixed(2) || '0.00'}`);
  
  console.log('\n🔑 Credenciais de Acesso:');
  console.log('Maria Silva: maria@mei.com / 123456');
  console.log('João Santos: joao@mei.com / 123456');
  
  console.log('\n✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 