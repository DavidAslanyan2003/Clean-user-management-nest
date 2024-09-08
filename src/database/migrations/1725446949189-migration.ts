import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725446949189 implements MigrationInterface {
    name = 'Migration1725446949189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_us" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "subject" character varying(255) NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" jsonb, "status" character varying DEFAULT 'active', CONSTRAINT "PK_32b67ddf344608b5c2fb95bc90c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "slug" character varying(255), "title" jsonb NOT NULL, "short_description" jsonb NOT NULL, "description" jsonb NOT NULL, "created_at" TIMESTAMP, "updated_at" TIMESTAMP, "image_large" character varying(255), "image_small" character varying(255), "views_count" integer NOT NULL DEFAULT '0', "status" character varying DEFAULT 'draft', "blog_users" uuid, CONSTRAINT "UQ_0dc7e58d73a1390874a663bd599" UNIQUE ("slug"), CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_letter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "PK_5580de0d5d97a9eb6527d290ff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_categories" ("blogCategoryId" uuid NOT NULL, "blogId" uuid NOT NULL, CONSTRAINT "PK_3ca690885f506055a9e39922cf2" PRIMARY KEY ("blogCategoryId", "blogId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f8f1135a6f13571fe33d7f982f" ON "blog_categories" ("blogCategoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ec8c5775ab43ef27089ed84fe" ON "blog_categories" ("blogId") `);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_56f234ee05739e81a1e7c892a49" FOREIGN KEY ("blog_users") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_56f234ee05739e81a1e7c892a49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ec8c5775ab43ef27089ed84fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f8f1135a6f13571fe33d7f982f"`);
        await queryRunner.query(`DROP TABLE "blog_categories"`);
        await queryRunner.query(`DROP TABLE "news_letter"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`DROP TABLE "blog_category"`);
        await queryRunner.query(`DROP TABLE "contact_us"`);
    }

}
