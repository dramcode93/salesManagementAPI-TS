import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { Types } from "mongoose";
import { ProductModel } from "../../../../interfaces";
import productsModel from "../../../../models/productsModel";

@ValidatorConstraint({ async: true })
class IsMongoIdWithProductCheckConstraint implements ValidatorConstraintInterface {
    async validate(categoryId: string, args: ValidationArguments) {

        if (!Types.ObjectId.isValid(categoryId)) { return false; };

        const products: ProductModel[] = await productsModel.find({ category: categoryId });
        if (products && products.length > 0) {
            const deleteProducts = products.map(async (product: ProductModel): Promise<void> => { await productsModel.findByIdAndDelete(product._id); });
            await Promise.all(deleteProducts);
        };

        return true;
    };

    defaultMessage(args: ValidationArguments) { return 'Invalid category ID or there was an error while processing the related products'; };
};

export function IsMongoIdWithProductCheck(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsMongoIdWithProductCheckConstraint,
        });
    };
};