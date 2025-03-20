import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { StudentStatus } from '../../student_status/interfaces/student_status.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsStudentStatusExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel('StudentStatus') private readonly studentStatusModel: Model<StudentStatus>) {}

  async validate(studentStatusId: string, args: ValidationArguments) {
    const studentStatus = await this.studentStatusModel.findById(studentStatusId).exec();
    return !!studentStatus;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Student status with ID $value does not exist';
  }
}

export function IsStudentStatusExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStudentStatusExistsConstraint,
    });
  };
}