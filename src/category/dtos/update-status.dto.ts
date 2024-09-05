import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { CategoryStatus } from '../../helpers/constants/status';
import { IsValidStatus } from '../../helpers/validations/decorators/validate-status';

export class UpdateStatusDto {
  @ApiProperty({
    example: 'Active',
    description: 'Status of the category',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidStatus()
  status: CategoryStatus;
}
