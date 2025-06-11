import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('vendas')
@UseGuards(JwtAuthGuard)
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  create(@Body() createVendaDto: CreateVendaDto, @Request() req) {
    return this.vendasService.create(createVendaDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query() paginationDto: PaginationDto,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.vendasService.findAll(req.user.id, paginationDto, dataInicio, dataFim);
  }

  @Get('periodo')
  getVendasPorPeriodo(
    @Request() req,
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.vendasService.getVendasPorPeriodo(req.user.id, dataInicio, dataFim);
  }

  @Get('resumo-mensal')
  getResumoMensal(
    @Request() req,
    @Query('mes', ParseIntPipe) mes: number,
    @Query('ano', ParseIntPipe) ano: number,
  ) {
    return this.vendasService.getResumoMensal(req.user.id, mes, ano);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vendasService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendaDto: UpdateVendaDto,
    @Request() req,
  ) {
    return this.vendasService.update(id, updateVendaDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vendasService.remove(id, req.user.id);
  }
} 