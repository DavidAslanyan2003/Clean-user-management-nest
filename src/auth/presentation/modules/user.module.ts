import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserController } from '../controllers/create-user.controller';
import { CreateUserService } from 'src/auth/domain/services/create-user.service';
import { User } from 'src/auth/domain/entities/user.entity';
import { CreateUserRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/create-user.repository';
import { JwtService } from 'src/auth/infrastructure/services/jwt.service';
import { SaveAccessTokenRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/save-access-token.repository';
import { AccessToken } from 'src/auth/domain/entities/access-token.entity';
import { CreateUserCommandHandler } from 'src/auth/application/commands/handlers/create-user.handler';
import { UpdateUserController } from '../controllers/update-user.controller';
import { UpdateUserCommandHandler } from 'src/auth/application/commands/handlers/update-user.handler';
import { UpdateUserService } from 'src/auth/domain/services/update-user.service';
import { GetUserByIdQueryHandler } from 'src/auth/application/queries/handlers/get-user.handler';
import { ReadUserRepositoryQueryHandler } from 'src/auth/infrastructure/repositories/queries/read-user.repository';
import { GetUserController } from '../controllers/get-user.controller';
import { DeleteUserController } from '../controllers/delete-user.controller';
import { DeleteUserCommandHandler } from 'src/auth/application/commands/handlers/delete-user.handler';
import { DeleteUserService } from 'src/auth/domain/services/delete-user.service';
import { UpdateUserRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/update-user.repository';
import { DeleteUserRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/delete-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AccessToken])
  ],
  controllers: [
    CreateUserController,
    UpdateUserController,
    GetUserController,
    DeleteUserController
  ],
  providers: [
    CreateUserService,
    CreateUserRepositoryHandler,
    JwtService,
    SaveAccessTokenRepositoryHandler,
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    UpdateUserService,
    GetUserByIdQueryHandler,
    ReadUserRepositoryQueryHandler,
    DeleteUserCommandHandler,
    DeleteUserService,
    UpdateUserRepositoryHandler,
    DeleteUserRepositoryHandler
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
