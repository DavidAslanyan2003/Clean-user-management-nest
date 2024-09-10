import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FormsService } from '../services/forms.service';
import { NewsLetterDto } from '../dtos/news-letter.dto';
import { ContactUsDto } from '../dtos/contact-us.dto';

@Controller('v1/forms')
@ApiTags('Forms')
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post('news-letter')
  async postNewsLetterForm(@Body() newsLetterDto: NewsLetterDto) {
    return this.formsService.postNewsLetterForm(newsLetterDto);
  }

  @Post('contact-us')
  async postContactUsForm(@Body() contactUsDto: ContactUsDto) {
    return this.formsService.postContactUsForm(contactUsDto);
  }
}
