import {
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVendaDto {
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  @IsInt({ message: 'ID do produto deve ser um número inteiro' })
  @IsPositive({ message: 'ID do produto deve ser positivo' })
  produtoId: number;

  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsInt({ message: 'Quantidade deve ser um número inteiro' })
  @IsPositive({ message: 'Quantidade deve ser positiva' })
  quantidade: number;

  @IsNotEmpty({ message: 'Data da venda é obrigatória' })
  @IsDateString({}, { message: 'Data da venda deve estar em formato válido' })
  dataVenda: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  observacoes?: string;
} 