import { Repository } from "typeorm";
import { User } from "src/auth/domain/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IReadUserByEmailRepository } from "../../interfaces/read-user-by-email-repository.interface";
import { Email } from "src/auth/domain/value-objects/email.value-object";


export class ReadUserByEmailRepositoryQueryHandler implements IReadUserByEmailRepository {
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  public async read(email: Email): Promise<User | undefined> {
    const savedUser = await this.userRepository.findOne({
      where: { email: email }
    });

   return savedUser;
  }
}