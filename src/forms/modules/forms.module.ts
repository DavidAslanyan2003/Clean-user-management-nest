import { Module } from "@nestjs/common";
import { FormsController } from "../controllers/forms.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsLetter } from "../entities/news-letter.entity";
import { ContactUs } from "../entities/contact-us.entity";
import { FormsService } from "../services/forms.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsLetter, ContactUs])
  ],
  controllers: [FormsController],
  providers: [FormsService]
})
export class FormsModule {};