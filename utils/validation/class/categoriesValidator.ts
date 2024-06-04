import { IsMongoId, IsNotEmpty, IsString, Length, ValidationOptions, ValidationArguments, registerDecorator, Validate } from "class-validator";
import productsModel from "../../../models/productsModel";
import { ProductModel } from "../../../interfaces";

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
    @IsMongoId()
    @Validate(CheckProducts)
    id: string;
};

function CheckProducts(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'CheckProducts',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(categoryId: string) {
                    console.log(categoryId);
                    const products: ProductModel[] = await productsModel.find({ category: categoryId });
                    console.log(products);
                    if (products && products.length > 0) {
                        const deleteProducts = products.map(async (product: ProductModel) => { await productsModel.findByIdAndDelete(product._id) });
                        await Promise.all(deleteProducts);
                    };
                    return true;
                },
                defaultMessage(args: ValidationArguments) { return ''; },
            },
        });
    };
};