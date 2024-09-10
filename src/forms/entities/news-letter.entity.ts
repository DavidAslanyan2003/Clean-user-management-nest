import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'news_letter' })
export class NewsLetter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
