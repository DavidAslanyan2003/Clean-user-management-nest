import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RequiredLocale } from '../../constants/locale';

@ValidatorConstraint({ name: 'IsValidLocale', async: false })
class IsValidLocale implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'object' || value === null) return false;

    const keys = Object.keys(value);

    const areKeysAndValuesStrings = keys.every(
      (key) => typeof key === 'string' && typeof value[key] === 'string',
    );

    const areRequiredLocalesPresent = RequiredLocale.every((locale) =>
      keys.includes(locale),
    );

    return areKeysAndValuesStrings && areRequiredLocalesPresent;
  }

  defaultMessage(args: ValidationArguments) {
    return 'error.invalidLocaleRecord';
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
