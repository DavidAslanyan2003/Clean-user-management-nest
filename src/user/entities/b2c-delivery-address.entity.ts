import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from './country.entity';
import { City } from './city.entity';
import { B2CProfile } from './b2c-profile.entity';

@Entity('b2c_delivery_address')
export class B2CDeliveryAddress {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: 'string', maxLength: 255 })
  street: string;

  @ManyToOne(() => B2CProfile, (profile) => profile.deliveryAddress)
  @JoinColumn({ name: 'b2c_profile_id' })
  b2cProfile: B2CProfile;

  @ManyToOne(() => Country, (country) => country.delivaryAddress)
  @JoinColumn({ name: 'country_id' })
  @ApiProperty({ type: () => Country })
  country: Country;

  @ManyToOne(() => City, (city) => city.delivaryAddress)
  @JoinColumn({ name: 'city_id' })
  @ApiProperty({ type: () => City })
  city: City;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ type: 'string', maxLength: 255, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ type: 'string', maxLength: 255, nullable: true })
  postal_code: string;

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
}
