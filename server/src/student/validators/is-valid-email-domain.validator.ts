import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isValidEmailDomain', async: false })
@Injectable()
export class EmailDomainValidator implements ValidatorConstraintInterface {
  constructor(private configService: ConfigService) {}

  validate(email: string, args: ValidationArguments): boolean {
    if (!email) return true;
    
    const allowedDomains = this.configService?.get<string[]>('validation.email.allowedDomains') || [];
    
    if (allowedDomains.length === 0) return true;
    
    const isValid = allowedDomains.some(domain => email.endsWith(domain));    
    return isValid;
  }

  defaultMessage(args: ValidationArguments): string {
    const allowedDomains = this.configService?.get<string[]>('validation.email.allowedDomains') || [];
    return `Email must belong to one of the following domains: ${allowedDomains.join(', ')}`;
  }
}

export function IsValidEmailDomain(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEmailDomain',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailDomainValidator,
    });
  };
} 