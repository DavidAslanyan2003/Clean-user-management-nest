import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class Uuid {
  constructor(public readonly id: string = uuidv4()) {
    if (!uuidValidate(id)) {
      throw new Error('Invalid UUID');
    }
  }

  public static fromString(id: string): Uuid {
    if (!uuidValidate(id)) {
      throw new Error('Invalid UUID');
    }
    return new Uuid(id);
  }

  public equals(other: Uuid): boolean {
    return this.id === other.id;
  }
}
