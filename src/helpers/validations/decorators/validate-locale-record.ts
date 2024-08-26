import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RequiredLocale } from '../../constants/locale';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';

@ValidatorConstraint({ name: 'IsValidLocale', async: false })
class IsValidLocale implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
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
    return `${ERROR_FILE_PATH}.INVALID_LOCALE_RECORD`;
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
