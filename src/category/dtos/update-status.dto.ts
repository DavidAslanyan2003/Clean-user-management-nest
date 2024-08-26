import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ERROR_FILE_NAMES_PATH } from 'src/helpers/constants/constants';
import { CategoryStatus } from 'src/helpers/constants/status';
import { IsValidStatus } from 'src/helpers/validations/decorators/validate-status';

export class UpdateStatusDto {
  @ApiProperty({
    example: 'Active',
    description: 'Status of the category',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_NAMES_PATH}.IS_EMPTY` })
  @IsValidStatus()
  status: CategoryStatus;
}
