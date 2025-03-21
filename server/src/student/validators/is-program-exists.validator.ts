import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { Program } from '../../program/interfaces/program.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsProgramExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel('Program') private readonly programModel: Model<Program>) {}

  async validate(programId: string, args: ValidationArguments) {
    const program = await this.programModel.findById(programId).exec();
    return !!program;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Program with ID $value does not exist';
  }
}

export function IsProgramExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProgramExistsConstraint,
    });
  };
}