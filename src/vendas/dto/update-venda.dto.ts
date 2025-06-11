import {
  IsOptional,
  IsInt,
  IsPositive,
  IsDateString,
  IsString,
} from 'class-validator';

export class UpdateVendaDto {
  @IsOptional()
  @IsInt({ message: 'Quantidade deve ser um número inteiro' })
  @IsPositive({ message: 'Quantidade deve ser positiva' })
  quantidade?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Data da venda deve estar em formato válido' })
  dataVenda?: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  observacoes?: string;
} 