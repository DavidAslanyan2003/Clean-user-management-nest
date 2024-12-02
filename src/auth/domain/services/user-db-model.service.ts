import { mapUserData } from "src/helpers/user-mapper";
import { ReadUserResultDto } from "../../application/commands/dtos/output/read-user-result.dto";
import { UserStatus } from "../../presentation/enums/user-status.enum";
import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email.value-object";

export class UserDbModelService {
  private readonly users: User[] = [
    {
      id: "817daf5f-da6b-4c8c-ac62-b1ecb0a5f94d",
      firstName: "David",
      lastName: "Aslanyan",
      created_at: new Date,
      updated_at: null,
      password: 'david123',
      status: UserStatus.ACTIVE,
      email: Email.create('david@gmail.com')
    },
    {
      id: "25ac3791-fbfd-4a85-b2f2-52b372fa6587",
      firstName: "John",
      lastName: "Doe",
      created_at: new Date,
      updated_at: null,
      status: UserStatus.ACTIVE,
      password: 'john123',
      email: Email.create('john.doe@gmail.com')
    }
];

  public async saveUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  public async findUserById(id: string): Promise<ReadUserResultDto | undefined> {
    const user = this.users.find(user => user.id === id);
    if (user) {
      return mapUserData(user);
    }

  }

  public async findAllUsers(): Promise<User[]> {
    return this.users;
  }
}
