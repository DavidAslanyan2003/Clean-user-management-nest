import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1727160979914 implements MigrationInterface {
    name = 'Migration1727160979914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`);
        await queryRunner.query(`ALTER TABLE "blog" ADD "images" character varying array`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
