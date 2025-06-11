import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiInfo() {
    return {
      name: 'Gestão de Vendas - MEI API',
      version: '1.0.0',
      description: 'API para gestão de vendas para Microempreendedores Individuais',
      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
        },
        users: 'GET /api/users',
        produtos: 'GET /api/produtos',
        vendas: 'GET /api/vendas',
        relatorios: {
          dashboard: 'GET /api/relatorios/dashboard',
          comparativo: 'GET /api/relatorios/comparativo-mensal',
          detalhado: 'GET /api/relatorios/detalhado',
          exportar: 'GET /api/relatorios/exportar',
        },
      },
      documentation: 'Consulte o README.md para documentação completa',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
