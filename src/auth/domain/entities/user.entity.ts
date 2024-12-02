import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserStatus } from '../../presentation/enums/user-status.enum';
import { Email } from '../value-objects/email.value-object';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a3',
    description: 'ID for user',
  })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public readonly created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  public readonly updated_at: Date | null;

  @ApiProperty({ example: 'Status', description: 'Status of the user' })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  public status?: UserStatus;

  @ApiProperty({ example: 'Firstname', description: 'FirstName of the user' })
  @Column({ type: 'varchar', length: 255 })
  public firstName: string;

  @ApiProperty({ example: 'Lastname', description: 'LastName of the user' })
  @Column({ type: 'varchar', length: 255 })
  public lastName: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'Email of the user' })
  @Column({ type: 'varchar', length: 255, unique: true })
  public email: Email;

  @ApiProperty({ example: 'password', description: 'Password of the user' })
  @Column({ type: 'varchar', length: 255 })
  public password: string;

  constructor(
    firstName: string,
    lastName: string,
    email: Email,
    password: string,
    updated_at?: Date | null,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.updated_at = updated_at ?? null;
  }
};

