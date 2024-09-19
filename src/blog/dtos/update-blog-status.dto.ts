import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';
import { BlogUpdateStatus } from 'src/helpers/enums/blogStatus.enum';

export class UpdateBlogStatusDto {
  @ApiProperty({
    example: 'active',
    description: 'Status of the blog',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  status: BlogUpdateStatus;
}
