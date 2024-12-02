import { UserStatus } from "../../presentation/enums/user-status.enum";
import { Email } from "../value-objects/email.value-object";

export class UserModel {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: Email;
  private _password: string;
  private _status: UserStatus;
  private _created_at: Date;
  private _updated_at: Date | null;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: Email,
    password: string,
    status: UserStatus,
    created_at: Date,
    updated_at: Date | null
  ) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._password = password;
    this._status = status;
    this._created_at = created_at;
    this._updated_at = updated_at
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get status(): UserStatus {
    return this._status;
  }

  get email(): Email {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get getCreatedAt(): string {
    return `${this._created_at}`
  }

  get getUpdatedAt(): string {
    return `${this._updated_at}`
  }

  set password(password: string) {
    this._password = password;
  }
}
