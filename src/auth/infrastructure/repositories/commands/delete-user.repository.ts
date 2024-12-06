import { CreateUserResultDto } from "../../../application/commands/dtos/output/create-user-result.dto";
import { User } from "../../../domain/entities/user.entity";
import { Repository } from "typeorm";
import { IUpdateUserRepository } from "../../interfaces/update-user-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";


export class DeleteUserRepositoryHandler implements IUpdateUserRepository {
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  public async save(createUserDto: User): Promise<CreateUserResultDto> {
    const savedUser = await this.userRepository.save(createUserDto);

    return savedUser;
  }
}