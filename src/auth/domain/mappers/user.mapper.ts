import { User } from "../entities/user.entity";
import { UserModel } from "../models/user.model";


export class UserMapper {
  static toEntity(userModel: UserModel): User {
    const user = new User(
      userModel.firstName,
      userModel.lastName,
      userModel.email,
      userModel.password,
      userModel.created_at,
      userModel.updated_at,
      userModel.status
    );
    
    return user;
  }

  static toModel(user: User): UserModel {
    return new UserModel(
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.id,
      user.status,
      user.created_at,
      user.updated_at,
    );
  }
}
