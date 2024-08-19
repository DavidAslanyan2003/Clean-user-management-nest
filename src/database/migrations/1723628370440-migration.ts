import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1723628370440 implements MigrationInterface {
  name = 'Migration1723628370440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "updated_event_cover_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_images_id" uuid NOT NULL, "event_id" uuid NOT NULL, "image_type" character varying(255) NOT NULL, "image_name" character varying(255) NOT NULL, "created_at" date NOT NULL, CONSTRAINT "PK_dd7dcf985e54b78974799bcc58c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event_cover_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid NOT NULL, "image_type" character varying(255) NOT NULL, "image_url" text NOT NULL, "content_type" character varying(255) NOT NULL, "created_at" date NOT NULL, "updated_at" date, CONSTRAINT "PK_66fa3dd07d7365a3b8c95c36d6b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "updated_event_date_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_date_info_id" uuid NOT NULL, "event_id" uuid NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "timezone" character varying NOT NULL, "created_at" date NOT NULL, "is_new" boolean NOT NULL, CONSTRAINT "PK_8c6bd4a1f516ae0c8ec890c8456" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event_date_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "timezone" character varying NOT NULL, "created_at" date NOT NULL, "updated_at" date, CONSTRAINT "PK_e38314af0a68683053616f334a2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "FAQ" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" jsonb NOT NULL, "answer" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_info_id" uuid, "updated_event_info_id" uuid, CONSTRAINT "PK_a798c38ee57a45ec1ed3c0fb501" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tag_name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."updated_event_info_dates_type_enum" AS ENUM('single', 'multiple')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."updated_event_info_event_type_enum" AS ENUM('online', 'inVenue')`
    );
    await queryRunner.query(
      `CREATE TABLE "updated_event_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_info_id" uuid NOT NULL, "event_id" uuid NOT NULL, "dates_type" "public"."updated_event_info_dates_type_enum", "event_type" "public"."updated_event_info_event_type_enum", "title" jsonb, "description" jsonb, "created_at" date NOT NULL, "updated_at" date, "is_new" boolean NOT NULL, CONSTRAINT "PK_40473db913d14690dc9c22b5792" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_info_dates_type_enum" AS ENUM('single', 'multiple')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_info_event_type_enum" AS ENUM('online', 'inVenue')`
    );
    await queryRunner.query(
      `CREATE TABLE "event_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid, "dates_type" "public"."event_info_dates_type_enum", "event_type" "public"."event_info_event_type_enum", "title" jsonb, "description" jsonb, "created_at" date NOT NULL, "updated_at" date, CONSTRAINT "PK_6d10e4edf845e1993d203a03835" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "timezone" character varying NOT NULL, "title" jsonb NOT NULL, "description" jsonb, "location" character varying, "speaker_name" jsonb, "speaker_profession" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "image_URL" character varying, "agenda_id" uuid, CONSTRAINT "PK_5b1f733c4ba831a51f3c114607b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "agenda" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid, "update_event_id" uuid, CONSTRAINT "PK_49397cfc20589bebaac8b43251d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "update-event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" date NOT NULL, "updated_at" date, "updated_by" uuid, "review_date" date, "reviewed_by" uuid, "comments" text, "is_new" boolean NOT NULL, CONSTRAINT "PK_3f50b55541a2d7a07a3c0c10b99" PRIMARY KEY ("id")); COMMENT ON COLUMN "update-event"."comments" IS 'Comments of the event'`
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "created_at" date NOT NULL, "updated_at" date, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid NOT NULL, "category_id" uuid NOT NULL, "created_at" date NOT NULL, "updated_at" date, CONSTRAINT "PK_697909a55bde1b28a90560f3ae2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_name" character varying(255) NOT NULL, "created_at" date NOT NULL, "is_active" boolean NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "updated_event_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_id" uuid NOT NULL, "event_id" uuid, "created_at" date NOT NULL, CONSTRAINT "PK_46e1e263bdbc98427dd31992607" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event_info_tag" ("tag_id" uuid NOT NULL, "event_info_id" uuid NOT NULL, CONSTRAINT "PK_6428a5e7937bf2dd52fc7398f92" PRIMARY KEY ("tag_id", "event_info_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d85159c514cc45e7d5858cd4cf" ON "event_info_tag" ("tag_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61b67d6ba547870f5ab9e905d8" ON "event_info_tag" ("event_info_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "updated_event_info_tag" ("tag_id" uuid NOT NULL, "updated_event_info_id" uuid NOT NULL, CONSTRAINT "PK_f66b41d7a7377229a6647d0cd00" PRIMARY KEY ("tag_id", "updated_event_info_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d851d7008ae7d10041bcda9942" ON "updated_event_info_tag" ("tag_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28f9ecc3fa31a0f3ca30d77d5a" ON "updated_event_info_tag" ("updated_event_info_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_cover_image" ADD CONSTRAINT "FK_d5c8585b814259d11426e696f29" FOREIGN KEY ("event_images_id") REFERENCES "event_cover_image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_cover_image" ADD CONSTRAINT "FK_fbf66210059d53600444af3a038" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_date_info" ADD CONSTRAINT "FK_3a1c2d6fc6fc13af61353aac773" FOREIGN KEY ("event_date_info_id") REFERENCES "event_date_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_date_info" ADD CONSTRAINT "FK_f9f042636c2c6e6e40d26d98fd8" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" ADD CONSTRAINT "FK_bfff0325eeaef01a3238efc1424" FOREIGN KEY ("event_info_id") REFERENCES "event_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" ADD CONSTRAINT "FK_6961dd3fbec0a9010d5d9fec3e5" FOREIGN KEY ("updated_event_info_id") REFERENCES "updated_event_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_info" ADD CONSTRAINT "FK_b835363c8592d906ba181eb75f9" FOREIGN KEY ("event_info_id") REFERENCES "event_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_info" ADD CONSTRAINT "FK_a1312ce9cb467fcc41649a5d369" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "slot" ADD CONSTRAINT "FK_10bce4568d8c53ee457d34cd441" FOREIGN KEY ("agenda_id") REFERENCES "agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_2d1f04ea60f7ca9b758000ad5dc" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_a5f33ca84ce99a6e0f721ff7a91" FOREIGN KEY ("update_event_id") REFERENCES "update-event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "update-event" ADD CONSTRAINT "FK_d010485da1d64099572cf69fb6c" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_category" ADD CONSTRAINT "FK_398cd1b29fa675d0ed4d73944d4" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_category" ADD CONSTRAINT "FK_f81a9c9dcf8e57514363383fcad" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_category" ADD CONSTRAINT "FK_f7c74e69c122a7fc29c0139da00" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_info_tag" ADD CONSTRAINT "FK_d85159c514cc45e7d5858cd4cf7" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "event_info_tag" ADD CONSTRAINT "FK_61b67d6ba547870f5ab9e905d8b" FOREIGN KEY ("event_info_id") REFERENCES "event_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_info_tag" ADD CONSTRAINT "FK_d851d7008ae7d10041bcda99425" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_info_tag" ADD CONSTRAINT "FK_28f9ecc3fa31a0f3ca30d77d5aa" FOREIGN KEY ("updated_event_info_id") REFERENCES "updated_event_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "updated_event_info_tag" DROP CONSTRAINT "FK_28f9ecc3fa31a0f3ca30d77d5aa"`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_info_tag" DROP CONSTRAINT "FK_d851d7008ae7d10041bcda99425"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_info_tag" DROP CONSTRAINT "FK_61b67d6ba547870f5ab9e905d8b"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_info_tag" DROP CONSTRAINT "FK_d85159c514cc45e7d5858cd4cf7"`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_category" DROP CONSTRAINT "FK_f7c74e69c122a7fc29c0139da00"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_category" DROP CONSTRAINT "FK_f81a9c9dcf8e57514363383fcad"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_category" DROP CONSTRAINT "FK_398cd1b29fa675d0ed4d73944d4"`
    );
    await queryRunner.query(
      `ALTER TABLE "update-event" DROP CONSTRAINT "FK_d010485da1d64099572cf69fb6c"`
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" DROP CONSTRAINT "FK_a5f33ca84ce99a6e0f721ff7a91"`
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" DROP CONSTRAINT "FK_2d1f04ea60f7ca9b758000ad5dc"`
    );
    await queryRunner.query(
      `ALTER TABLE "slot" DROP CONSTRAINT "FK_10bce4568d8c53ee457d34cd441"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_info" DROP CONSTRAINT "FK_a1312ce9cb467fcc41649a5d369"`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_info" DROP CONSTRAINT "FK_b835363c8592d906ba181eb75f9"`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" DROP CONSTRAINT "FK_6961dd3fbec0a9010d5d9fec3e5"`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" DROP CONSTRAINT "FK_bfff0325eeaef01a3238efc1424"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_date_info" DROP CONSTRAINT "FK_f9f042636c2c6e6e40d26d98fd8"`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_date_info" DROP CONSTRAINT "FK_3a1c2d6fc6fc13af61353aac773"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_cover_image" DROP CONSTRAINT "FK_fbf66210059d53600444af3a038"`
    );
    await queryRunner.query(
      `ALTER TABLE "updated_event_cover_image" DROP CONSTRAINT "FK_d5c8585b814259d11426e696f29"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28f9ecc3fa31a0f3ca30d77d5a"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d851d7008ae7d10041bcda9942"`
    );
    await queryRunner.query(`DROP TABLE "updated_event_info_tag"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_61b67d6ba547870f5ab9e905d8"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d85159c514cc45e7d5858cd4cf"`
    );
    await queryRunner.query(`DROP TABLE "event_info_tag"`);
    await queryRunner.query(`DROP TABLE "updated_event_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "event_category"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "update-event"`);
    await queryRunner.query(`DROP TABLE "agenda"`);
    await queryRunner.query(`DROP TABLE "slot"`);
    await queryRunner.query(`DROP TABLE "event_info"`);
    await queryRunner.query(`DROP TYPE "public"."event_info_event_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."event_info_dates_type_enum"`);
    await queryRunner.query(`DROP TABLE "updated_event_info"`);
    await queryRunner.query(
      `DROP TYPE "public"."updated_event_info_event_type_enum"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."updated_event_info_dates_type_enum"`
    );
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "FAQ"`);
    await queryRunner.query(`DROP TABLE "event_date_info"`);
    await queryRunner.query(`DROP TABLE "updated_event_date_info"`);
    await queryRunner.query(`DROP TABLE "event_cover_image"`);
    await queryRunner.query(`DROP TABLE "updated_event_cover_image"`);
  }
}
