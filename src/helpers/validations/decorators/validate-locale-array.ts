import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RequiredLocale } from '../../constants/locale';
import { ERROR_FILE_PATH } from '../../../helpers/constants/constants';

@ValidatorConstraint({ name: 'IsValidLocaleArray', async: false })
class IsValidLocaleArray implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }

    const areRequiredLocalesPresent = RequiredLocale.every((locale) =>
      value.every((item) =>
        Object.keys(Object.values(item)[0]).includes(locale),
      ),
    );

    return areRequiredLocalesPresent;
  }

  defaultMessage(args: ValidationArguments) {
    return `${ERROR_FILE_PATH}.INVALID_LOCALE_RECORD`;
  }
}

export function IsValidLocaleArrayRecord(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidLocaleArrayRecord',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidLocaleArray,
    });
  };
}
