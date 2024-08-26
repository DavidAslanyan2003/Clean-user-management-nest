import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';

@ValidatorConstraint({ async: false })
export class IsValidPath implements ValidatorConstraintInterface {
  validate(url: string, args: ValidationArguments): boolean {
    try {
      new URL(url);

      return true;
    } catch (_) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${ERROR_FILE_PATH}.INVALID_URL`;
  }
}

export function IsValidUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPath,
    });
  };
}
