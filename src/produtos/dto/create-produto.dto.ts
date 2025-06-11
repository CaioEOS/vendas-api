import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @IsNotEmpty({ message: 'Preço é obrigatório' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Preço deve ser um número válido' },
  )
  @Transform(({ value }) => parseFloat(value))
  preco: number;

  @IsOptional()
  @IsString({ message: 'Categoria deve ser uma string' })
  categoria?: string;

  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um boolean' })
  ativo?: boolean = true;
}