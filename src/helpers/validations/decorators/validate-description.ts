import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { ERROR_FILE_NAMES_PATH } from 'src/helpers/constants/constants';

@ValidatorConstraint({ async: false })
export class MatchKeysInNameAndDescription
  implements ValidatorConstraintInterface
{
  validate(description: any, args: ValidationArguments) {
    const name = (args.object as any)[args.constraints[0]];
    if (!description || !name) return true;

    const descriptionKeys = Object.keys(description);
    const nameKeys = Object.keys(name);

    return descriptionKeys.every((key) => nameKeys.includes(key));
  }

  defaultMessage(args: ValidationArguments) {
    return `${ERROR_FILE_NAMES_PATH}.KEY_MISMATCH`;
  }
}

export function MatchDescriptionKeysInName(nameProperty: string) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [nameProperty],
      validator: MatchKeysInNameAndDescription,
    });
  };
}
