import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";
import { IsMongoIdWithProductCheck } from "./Dtos/categories.dto";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    name: string;
};

export class GetCategoryDto {
    @IsMongoId()
    id: string;
};

export class UpdateCategoryDto extends CreateCategoryDto {
    @IsMongoId()
    id: string;
};

export class DeleteCategoryDto {
    @IsMongoIdWithProductCheck()
    id: string;
};