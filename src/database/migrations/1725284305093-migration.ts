import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725284305093 implements MigrationInterface {
    name = 'Migration1725284305093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_us" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "subject" character varying(255) NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_post_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" jsonb, "status" character varying DEFAULT 'active', CONSTRAINT "PK_543439d139e604f9553a07dfa3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "slug" character varying(255), "title" jsonb NOT NULL, "short_description" jsonb NOT NULL, "description" jsonb NOT NULL, "created_at" TIMESTAMP, "updated_at" TIMESTAMP, "image_large" character varying(255), "image_small" character varying(255), "views_count" integer NOT NULL DEFAULT '0', "status" character varying DEFAULT 'draft', "blog_posts_users" uuid, CONSTRAINT "UQ_7a1f994eda1ad6e18788ca90b9e" UNIQUE ("slug"), CONSTRAINT "PK_694e842ad1c2b33f5939de6fede" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_letter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "PK_5580de0d5d97a9eb6527d290ff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_posts_categories" ("blogPostCategoryId" uuid NOT NULL, "blogPostId" uuid NOT NULL, CONSTRAINT "PK_597bd7247b9e4d83b07ef12f611" PRIMARY KEY ("blogPostCategoryId", "blogPostId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc4f43d1639815bdcd086bb916" ON "blog_posts_categories" ("blogPostCategoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_83722beaaf318cd631e0b418a3" ON "blog_posts_categories" ("blogPostId") `);
        await queryRunner.query(`ALTER TABLE "blog_post" ADD CONSTRAINT "FK_96157986af13c30fe0c1f0e6aa3" FOREIGN KEY ("blog_posts_users") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_cc4f43d1639815bdcd086bb9168" FOREIGN KEY ("blogPostCategoryId") REFERENCES "blog_post_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_83722beaaf318cd631e0b418a3b" FOREIGN KEY ("blogPostId") REFERENCES "blog_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_83722beaaf318cd631e0b418a3b"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_cc4f43d1639815bdcd086bb9168"`);
        await queryRunner.query(`ALTER TABLE "blog_post" DROP CONSTRAINT "FK_96157986af13c30fe0c1f0e6aa3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83722beaaf318cd631e0b418a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc4f43d1639815bdcd086bb916"`);
        await queryRunner.query(`DROP TABLE "blog_posts_categories"`);
        await queryRunner.query(`DROP TABLE "news_letter"`);
        await queryRunner.query(`DROP TABLE "blog_post"`);
        await queryRunner.query(`DROP TABLE "blog_post_category"`);
        await queryRunner.query(`DROP TABLE "contact_us"`);
    }

}
