import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { Faculty } from '../../faculty/interfaces/faculty.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsFacultyExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel('Faculty') private readonly facultyModel: Model<Faculty>) {}

  async validate(facultyId: string, args: ValidationArguments) {
    const faculty = await this.facultyModel.findById(facultyId).exec();
    return !!faculty;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Faculty with ID $value does not exist';
  }
}

export function IsFacultyExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFacultyExistsConstraint,
    });
  };
}