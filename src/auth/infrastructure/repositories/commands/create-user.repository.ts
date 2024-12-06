import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserResultDto } from "../../../application/commands/dtos/output/create-user-result.dto";
import { User } from "../../../domain/entities/user.entity";
import { ICreateUserRepository } from "../../interfaces/create-user-repository.interface";
import { Repository } from "typeorm";


export class CreateUserRepositoryHandler implements ICreateUserRepository {
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async save(createUserDto: User): Promise<CreateUserResultDto> {
    const savedUser = await this.userRepository.save(createUserDto);

    return savedUser;
  }
}