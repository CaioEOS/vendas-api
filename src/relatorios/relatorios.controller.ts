import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('relatorios')
@UseGuards(JwtAuthGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.relatoriosService.getDashboard(req.user.id);
  }

  @Get('comparativo-mensal')
  getComparativoMensal(
    @Request() req,
    @Query('ano', ParseIntPipe) ano: number,
  ) {
    return this.relatoriosService.getComparativoMensal(req.user.id, ano);
  }

  @Get('detalhado')
  getRelatorioDetalhado(
    @Request() req,
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.getRelatorioDetalhado(
      req.user.id,
      dataInicio,
      dataFim,
    );
  }

  @Get('exportar')
  async exportarDados(
    @Request() req,
    @Query('formato') formato: 'json' | 'csv' = 'json',
    @Res() res: Response,
  ) {
    const dados = await this.relatoriosService.exportarDados(
      req.user.id,
      formato,
    );

    if (formato === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="vendas-export.csv"',
      );
      return res.send(dados);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="vendas-export.json"',
    );
    return res.json(dados);
  }
} 