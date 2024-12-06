import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserController } from '../controllers/create-user.controller';
import { UserManagementService } from 'src/auth/domain/services/user-management.service';
import { User } from 'src/auth/domain/entities/user.entity';
import { CreateUserRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/create-user.repository';
import { JwtService } from 'src/auth/infrastructure/services/jwt.service';
import { SaveAccessTokenRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/save-access-token.repository';
import { AccessToken } from 'src/auth/domain/entities/access-token.entity';
import { CreateUserCommandHandler } from 'src/auth/application/commands/handlers/create-user.handler';
import { UpdateUserController } from '../controllers/update-user.controller';
import { UpdateUserCommandHandler } from 'src/auth/application/commands/handlers/update-user.handler';
import { GetUserByIdQueryHandler } from 'src/auth/application/queries/handlers/get-user.handler';
import { GetUserByIdRepositoryQueryHandler } from 'src/auth/infrastructure/repositories/queries/read-user-by-id.repository';
import { GetUserController } from '../controllers/get-user.controller';
import { DeleteUserController } from '../controllers/delete-user.controller';
import { UpdateUserRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/update-user.repository';
import { DeleteUserRepositoryHandler } from 'src/auth/infrastructure/repositories/commands/delete-user.repository';
import { CreateAccesssTokenCommandHandler } from 'src/auth/application/commands/handlers/create-access-token.handler';
import { LoginUserController } from '../controllers/login-user.controller';
import { GetUserByEmailQueryHandler } from 'src/auth/application/queries/handlers/get-user-by-email.handler';
import { ReadUserByEmailRepositoryQueryHandler } from 'src/auth/infrastructure/repositories/queries/read-user-by-email.repository';
import { LogoutUserController } from '../controllers/logout-user.controller';
import { GetAccessTokenByUserIdQueryHandler } from 'src/auth/application/queries/handlers/get-access-token-by-user-id.handler';
import { ReadAccessTokenByUserIdRepositoryQueryHandler } from 'src/auth/infrastructure/repositories/queries/read-access-token-by-user-id.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AccessToken])
  ],
  controllers: [
    CreateUserController,
    UpdateUserController,
    GetUserController,
    DeleteUserController,
    LoginUserController,
    LogoutUserController
  ],
  providers: [
    UserManagementService,
    CreateUserRepositoryHandler,
    JwtService,
    SaveAccessTokenRepositoryHandler,
    CreateAccesssTokenCommandHandler,
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    GetUserByIdQueryHandler,
    GetUserByIdRepositoryQueryHandler,
    UpdateUserRepositoryHandler,
    DeleteUserRepositoryHandler,
    GetUserByEmailQueryHandler,
    ReadUserByEmailRepositoryQueryHandler,
    GetAccessTokenByUserIdQueryHandler,
    ReadAccessTokenByUserIdRepositoryQueryHandler
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
