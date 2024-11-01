import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1730463183104 implements MigrationInterface {
  name = 'Migration1730463183104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`,
    );
    await queryRunner.query(
      `CREATE TABLE "faq" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" jsonb NOT NULL, "answer" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "event_id" uuid, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tag_name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "timezone" character varying(255) NOT NULL, "title" jsonb NOT NULL, "description" jsonb, "location" character varying(255), "speaker_name" jsonb, "speaker_profession" jsonb, "image_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "agenda_id" uuid, CONSTRAINT "PK_5b1f733c4ba831a51f3c114607b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agenda" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "event_instance_id" uuid, CONSTRAINT "PK_49397cfc20589bebaac8b43251d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_instance_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_instance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."event_instance_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "event_id" uuid, CONSTRAINT "PK_27acb27041c443a7a4763cc89c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_status_enum" AS ENUM('draft', 'inReview', 'active', 'deleted', 'inactive', 'ended')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."event_status_enum" NOT NULL DEFAULT 'draft', "slug" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "user_id" uuid, CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8" UNIQUE ("slug"), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(255) NOT NULL, "old_value" jsonb NOT NULL, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3af0b29c4866031db85f023f186" UNIQUE ("old_value"), CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cover_image" character varying NOT NULL, "images" character varying array, "video_link" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "event_instance_id" uuid, CONSTRAINT "REL_f627e18939ed0da7bea9ae0e5a" UNIQUE ("event_instance_id"), CONSTRAINT "PK_4e5f0c8c1718c8c2026c15296af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "basic_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_title" jsonb NOT NULL, "event_description" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "event_id" uuid, CONSTRAINT "REL_f24cb2840e0638467880e08a88" UNIQUE ("event_id"), CONSTRAINT "PK_4d6e4a85199cd524fa0954e665d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "event_instance_id" uuid, CONSTRAINT "REL_4145014b5d81f13459b1a1863f" UNIQUE ("event_instance_id"), CONSTRAINT "PK_401724822174c3539ee7036da15" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_tag" ("tag_id" uuid NOT NULL, "event_id" uuid NOT NULL, CONSTRAINT "PK_b2e240c76ed8ac07e36e5514efb" PRIMARY KEY ("tag_id", "event_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd388aa11a6c289a257c490326" ON "event_tag" ("tag_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2613e3b02f6840bbef2cffbcb" ON "event_tag" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "event_category" ("category_id" uuid NOT NULL, "event_id" uuid NOT NULL, CONSTRAINT "PK_04f5cce98d42a753e3b0fec03e7" PRIMARY KEY ("category_id", "event_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_398cd1b29fa675d0ed4d73944d" ON "event_category" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f81a9c9dcf8e57514363383fca" ON "event_category" ("event_id") `,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_type"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletion_reason"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_8e1f623798118e629b46a9e6299"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "first_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "last_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "phone" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "user_type" "public"."user_user_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "language" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deletion_reason" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "faq" ADD CONSTRAINT "FK_7f1b47c64ea02a7f0b283a7c368" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "slot" ADD CONSTRAINT "FK_10bce4568d8c53ee457d34cd441" FOREIGN KEY ("agenda_id") REFERENCES "agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_b1d5584dbb20dad9a087f2e1c1b" FOREIGN KEY ("event_instance_id") REFERENCES "event_instance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_instance" ADD CONSTRAINT "FK_c35ffa3f10157a72e59d7a5aa4f" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_e6358bd3df1b2874637dca92bcf" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_media" ADD CONSTRAINT "FK_f627e18939ed0da7bea9ae0e5a7" FOREIGN KEY ("event_instance_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "basic_info" ADD CONSTRAINT "FK_f24cb2840e0638467880e08a882" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dates" ADD CONSTRAINT "FK_4145014b5d81f13459b1a1863f7" FOREIGN KEY ("event_instance_id") REFERENCES "event_instance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_tag" ADD CONSTRAINT "FK_fd388aa11a6c289a257c4903265" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_tag" ADD CONSTRAINT "FK_d2613e3b02f6840bbef2cffbcbb" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_category" ADD CONSTRAINT "FK_398cd1b29fa675d0ed4d73944d4" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_category" ADD CONSTRAINT "FK_f81a9c9dcf8e57514363383fcad" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "event_category" DROP CONSTRAINT "FK_f81a9c9dcf8e57514363383fcad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_category" DROP CONSTRAINT "FK_398cd1b29fa675d0ed4d73944d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_tag" DROP CONSTRAINT "FK_d2613e3b02f6840bbef2cffbcbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_tag" DROP CONSTRAINT "FK_fd388aa11a6c289a257c4903265"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dates" DROP CONSTRAINT "FK_4145014b5d81f13459b1a1863f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "basic_info" DROP CONSTRAINT "FK_f24cb2840e0638467880e08a882"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_media" DROP CONSTRAINT "FK_f627e18939ed0da7bea9ae0e5a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_e6358bd3df1b2874637dca92bcf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_instance" DROP CONSTRAINT "FK_c35ffa3f10157a72e59d7a5aa4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" DROP CONSTRAINT "FK_b1d5584dbb20dad9a087f2e1c1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slot" DROP CONSTRAINT "FK_10bce4568d8c53ee457d34cd441"`,
    );
    await queryRunner.query(
      `ALTER TABLE "faq" DROP CONSTRAINT "FK_7f1b47c64ea02a7f0b283a7c368"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletion_reason"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_type"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_8e1f623798118e629b46a9e6299"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "phone" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "last_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "first_name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deletion_reason" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "language" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "user_type" "public"."user_user_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f81a9c9dcf8e57514363383fca"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_398cd1b29fa675d0ed4d73944d"`,
    );
    await queryRunner.query(`DROP TABLE "event_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2613e3b02f6840bbef2cffbcb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd388aa11a6c289a257c490326"`,
    );
    await queryRunner.query(`DROP TABLE "event_tag"`);
    await queryRunner.query(`DROP TABLE "dates"`);
    await queryRunner.query(`DROP TABLE "basic_info"`);
    await queryRunner.query(`DROP TABLE "event_media"`);
    await queryRunner.query(`DROP TABLE "audit_log"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TYPE "public"."event_status_enum"`);
    await queryRunner.query(`DROP TABLE "event_instance"`);
    await queryRunner.query(`DROP TYPE "public"."event_instance_status_enum"`);
    await queryRunner.query(`DROP TABLE "agenda"`);
    await queryRunner.query(`DROP TABLE "slot"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "faq"`);
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
