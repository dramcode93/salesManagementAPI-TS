import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { CategoryModel } from "../../../../interfaces";
import categoriesModel from "../../../../models/categoriesModel";
import { Request } from "express";

@ValidatorConstraint({ async: true })
class CheckCategory implements ValidatorConstraintInterface {
    async validate(categoryId: string, args: ValidationArguments) {
        const req: Request = args.object as Request;
        const category: CategoryModel | null = await categoriesModel.findOne({ _id: categoryId, shop: req.user?.shop });
        if (!category) { return false; } else { return true; };
    };

    defaultMessage(args: ValidationArguments) { return 'category not exist or not belong to this shop'; };
};

export function IsCategoryFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: CheckCategory,
        });
    };
};