import { IsMongoId, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateFinancialTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    money: number;

    @IsNotEmpty()
    transaction: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 150)
    reason: string;
};

export class GetFinancialTransactionDto {
    @IsMongoId()
    id: string;
};