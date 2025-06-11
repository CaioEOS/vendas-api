import {
  IsOptional,
  IsString,
  IsDecimal,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProdutoDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  nome?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'Preço deve ser um decimal válido' },
  )
  preco?: number;

  @IsOptional()
  @IsString({ message: 'Categoria deve ser uma string' })
  categoria?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um boolean' })
  ativo?: boolean;
} 