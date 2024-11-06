import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ERROR_FILE_PATH } from '../../../helpers/constants/constants';

@ValidatorConstraint({ async: false })
export class IsEndTimeAfterStartTimeConstraint
  implements ValidatorConstraintInterface
{
  validate(endTime: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const startTime = (args.object as any)[relatedPropertyName];

    return startTime && endTime && startTime < endTime;
  }

  defaultMessage(args: ValidationArguments) {
    return `${ERROR_FILE_PATH}.INVALID_END_TIME`;
  }
}

export function IsEndTimeAfterStartTime(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsEndTimeAfterStartTimeConstraint,
    });
  };
}
