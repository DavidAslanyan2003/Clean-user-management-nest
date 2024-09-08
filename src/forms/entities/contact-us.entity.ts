import { IsEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'contact_us' })
export class ContactUs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  subject: string;

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  message: string;
}
