import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isValidPhoneNumber', async: false })
@Injectable()
export class PhoneNumberValidator implements ValidatorConstraintInterface {
  constructor(private configService: ConfigService) {}

  validate(phone: string, args: ValidationArguments): boolean {
    if (!phone) return true;
    
    const phoneRegex = this.configService?.get<string>('validation.phoneNumber.regex') || "";
    
    const regex = new RegExp(phoneRegex);
    const isValid = regex.test(phone);
        
    return isValid;
  }

  defaultMessage(args: ValidationArguments): string {
    const country = this.configService?.get<string>('validation.phoneNumber.country') || 'Vietnamese';
    return `Invalid ${country} phone number format`;
  }
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: PhoneNumberValidator,
    });
  };
} 