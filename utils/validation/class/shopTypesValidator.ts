import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateShopTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    type_ar: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    type_en: string;
};

export class GetShopTypeDto {
    @IsMongoId()
    id: string;
};

export class UpdateShopTypeDto extends PartialType(CreateShopTypeDto) {
    @IsMongoId()
    id: string;
};

export class DeleteShopTypeDto extends GetShopTypeDto { };