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
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('produtos')
@UseGuards(JwtAuthGuard)
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto, @Request() req) {
    return this.produtosService.create(createProdutoDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.produtosService.findAll(req.user.id, paginationDto);
  }

  @Get('mais-vendidos')
  getMostSold(@Request() req, @Query('limit', ParseIntPipe) limit?: number) {
    return this.produtosService.getMostSold(req.user.id, limit);
  }

  @Get('categoria/:categoria')
  findByCategory(@Param('categoria') categoria: string, @Request() req) {
    return this.produtosService.findByCategory(categoria, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.produtosService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
    @Request() req,
  ) {
    return this.produtosService.update(id, updateProdutoDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.produtosService.remove(id, req.user.id);
  }
} 