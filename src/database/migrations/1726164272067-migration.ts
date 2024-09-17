import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1726164272067 implements MigrationInterface {
  name = 'Migration1726164272067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
