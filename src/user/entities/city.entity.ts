import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { B2CDeliveryAddress } from './b2c-delivery-address.entity';

@Entity('city')
export class City {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    format: 'uuid',
  })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: 'string', example: 'Yerevan' })
  name: string;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(
    () => B2CDeliveryAddress,
    (delivaryAddress) => delivaryAddress.city,
  )
  delivaryAddress: B2CDeliveryAddress[];
}
