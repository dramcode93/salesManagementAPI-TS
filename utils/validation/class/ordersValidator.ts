import { IsMongoId } from "class-validator";

export class GetOrderDto {
    @IsMongoId()
    id: string;
};