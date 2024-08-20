import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RequiredLocale } from '../../../helper/constants/locale';

class IsValidLocale implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'object' || value === null) return false;

    const keys = Object.keys(value);

    return (
      keys.every(
        (key) => typeof key === 'string' && typeof value[key] === 'string',
      ) && RequiredLocale.some((locale) => keys.includes(locale))
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `The ${args.property} must be an object with at least this required keys: ${RequiredLocale}`;
  }
}

export function IsValidLocaleRecord(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidLocaleRecord',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidLocale,
    });
  };
}
