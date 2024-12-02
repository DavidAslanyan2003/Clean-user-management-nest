export class UserModel {
  private _id: string;
  private _token: string;
  private _userId: string;
  private _created_at: Date;
  private _updated_at: Date | null;

  constructor(
    id: string,
    userId: string,
    token: string,
    created_at: Date,
    updated_at: Date | null
  ) {
    this._id = id;
    this._userId = userId;
    this._token = token;
    this._created_at = created_at;
    this._updated_at = updated_at
  }

  get id(): string {
    return this._id;
  }

  get getToken(): string {
    return this._token;
  }

  get getUserId(): string {
    return this._userId;
  }

  get getCreatedAt(): string {
    return `${this._created_at}`
  }

  get getUpdatedAt(): string {
    return `${this._updated_at}`
  }

  
}
