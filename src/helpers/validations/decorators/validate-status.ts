import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ERROR_FILE_NAME } from 'src/helpers/constants/constants';
import { ACTIVE_STATUS, INACTIVE_STATUS } from 'src/helpers/constants/status';

@ValidatorConstraint({ async: false })
export class CheckStatus implements ValidatorConstraintInterface {
  validate(status: string, args: ValidationArguments): boolean {
    if (
      status.toLowerCase() !== INACTIVE_STATUS.toLowerCase() &&
      status.toLowerCase() !== ACTIVE_STATUS.toLowerCase()
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${ERROR_FILE_NAME}.INVALID_STATUS`;
  }
}

export function IsValidStatus(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CheckStatus,
    });
  };
}
