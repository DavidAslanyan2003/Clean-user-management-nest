import { Repository } from "typeorm";
import { IGetUserByIdRepository } from "../../interfaces/read-user-repository.interface";
import { User } from "src/auth/domain/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";


export class GetUserByIdRepositoryQueryHandler implements IGetUserByIdRepository {
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  public async read(userId: string): Promise<User | undefined> {
    const savedUser = await this.userRepository.findOne({
      where: { id: userId }
    });

   return savedUser;
  }
}