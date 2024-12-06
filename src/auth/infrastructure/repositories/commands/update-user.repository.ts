import { CreateUserResultDto } from "../../../application/commands/dtos/output/create-user-result.dto";
import { User } from "../../../domain/entities/user.entity";
import { Repository } from "typeorm";
import { IUpdateUserRepository } from "../../interfaces/update-user-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";


export class UpdateUserRepositoryHandler implements IUpdateUserRepository {
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  public async save(updateUserDto: User): Promise<CreateUserResultDto> {
    const savedUser = await this.userRepository.save(updateUserDto);

    return savedUser;
  }
}
