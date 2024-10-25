import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729784896460 implements MigrationInterface {
  name = 'Migration1729784896460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`,
    );
    await queryRunner.query(
      `CREATE TABLE "device" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_identifier" character varying(255) NOT NULL, "device_name" character varying(255), "device_location" character varying(255), "last_ip_address" character varying(255), "last_activity" character varying(255), "push_notification_token" character varying(255), "app_version" character varying(255), "is_device_active" boolean NOT NULL DEFAULT true, "device_type" character varying(255) NOT NULL, "last_login" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7d4c065ecdd0d2b3261fb161378" UNIQUE ("device_identifier"), CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "device_id" uuid, CONSTRAINT "PK_f20f028607b2603deabd8182d12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "device_id" uuid, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."verification_code_status_enum" AS ENUM('active', 'inactive', 'verified')`,
    );
    await queryRunner.query(
      `CREATE TABLE "verification_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(10) NOT NULL, "status" "public"."verification_code_status_enum" NOT NULL, "sent_at" TIMESTAMP NOT NULL, "registration_method" character varying(255) NOT NULL, "profile_url" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_d702c086da466e5d25974512d46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_fee_fee_type_enum" AS ENUM('fixed', 'percentage', 'tiered')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_fee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fee_type" "public"."user_fee_fee_type_enum" NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_bc19cb683d4dd9568463a18bc34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."b2b_profile_profile_status_enum" AS ENUM('active', 'pending', 'unverified', 'inactive', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "b2b_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_image_path" character varying(255), "profile_type" character varying(255) NOT NULL, "profile_image_path" character varying(255), "legal_name" character varying(255), "venue_name" character varying(255), "stage_name" character varying(255), "genres" text array, "website" character varying(255) NOT NULL, "phone" character varying(255), "email" character varying(255), "facebook" character varying(255), "instagram" character varying(255), "linkedin" character varying(255), "portfolio_images" text array, "portfolio_videos" text array, "youtube_links" text array NOT NULL, "cover_photo_path" character varying(255), "bio" text, "profile_status" "public"."b2b_profile_profile_status_enum" NOT NULL, "address" character varying(255) NOT NULL, "rejected_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_e6d2c097b6e4a947f3bb0ada48" UNIQUE ("user_id"), CONSTRAINT "PK_8788913cc7789a67269056bb13d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."b2c_user_favorites_type_enum" AS ENUM('event', 'artist', 'venue', 'organizer')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."b2c_user_favorites_status_enum" AS ENUM('active', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "b2c_user_favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."b2c_user_favorites_type_enum" NOT NULL, "status" "public"."b2c_user_favorites_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "b2b_profile_id" uuid, CONSTRAINT "PK_e7f01a95771d026b3e5a6ab6840" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "b2c_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "loyalty_points" integer NOT NULL DEFAULT '0', "upcoming_events_count" integer NOT NULL DEFAULT '0', "following_list" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "delivery_id" uuid, CONSTRAINT "REL_61c63605b17c73230c2c43691c" UNIQUE ("user_id"), CONSTRAINT "PK_03b242515fc89f86eedae206a50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "b2c_delivery_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(255) NOT NULL, "state" character varying(255), "postal_code" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "b2c_profile_id" uuid, "country_id" uuid, "city_id" uuid, CONSTRAINT "PK_151a9b94fce4fb359158c666870" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2c5aa339240c0c3ae97fcc9dc4c" UNIQUE ("name"), CONSTRAINT "UQ_8ff4c23dc9a3f3856555bd86186" UNIQUE ("code"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_detail_subscription_type_enum" AS ENUM('free', 'per event', 'premium', 'enterprise')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_detail_status_enum" AS ENUM('active', 'inactive', 'expired')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription_detail" ("id" SERIAL NOT NULL, "subscription_type" "public"."subscription_detail_subscription_type_enum" NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "status" "public"."subscription_detail_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "b2b_profile_id" uuid, CONSTRAINT "REL_1332c28a349b7068c659d7923f" UNIQUE ("b2b_profile_id"), CONSTRAINT "PK_3efb4c9a07a798f168416cb2b18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_devices" ("device_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_69b11f34c0f681c815fb6971018" PRIMARY KEY ("device_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c0755b2e06094d9dfb353a377" ON "user_devices" ("device_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28bd79e1b3f7c1168f0904ce24" ON "user_devices" ("user_id") `,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
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
      `CREATE TYPE "public"."user_user_type_enum" AS ENUM('b2b', 'b2c', 'both')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "user_type" "public"."user_user_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'unverified', 'deleted', 'blocked')`,
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
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" ADD CONSTRAINT "FK_4bd9bc00776919370526766eb43" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" ADD CONSTRAINT "FK_013745f31593970f8b6f412388a" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_d0158ce1ea156acae12df627894" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" ADD CONSTRAINT "FK_20dc9f8d86616620881be140833" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_fee" ADD CONSTRAINT "FK_d65961bfb7279d25b7e41a67bf4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2b_profile" ADD CONSTRAINT "FK_e6d2c097b6e4a947f3bb0ada489" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_user_favorites" ADD CONSTRAINT "FK_18cb4b64b46e362d4d823b3db5b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_user_favorites" ADD CONSTRAINT "FK_0235676d1d86650aa7ebfd5e2b8" FOREIGN KEY ("b2b_profile_id") REFERENCES "b2b_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_profile" ADD CONSTRAINT "FK_61c63605b17c73230c2c43691c8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_profile" ADD CONSTRAINT "FK_24a36232144a72be5cb4ff61cd0" FOREIGN KEY ("delivery_id") REFERENCES "b2c_delivery_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_delivery_address" ADD CONSTRAINT "FK_d05d385566330edecc627a174a5" FOREIGN KEY ("b2c_profile_id") REFERENCES "b2c_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_delivery_address" ADD CONSTRAINT "FK_3b7be5a76d4793e32c94f5a3abb" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_delivery_address" ADD CONSTRAINT "FK_50f617f51944615311a1ad54924" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_detail" ADD CONSTRAINT "FK_1332c28a349b7068c659d7923f2" FOREIGN KEY ("b2b_profile_id") REFERENCES "b2b_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_devices" ADD CONSTRAINT "FK_7c0755b2e06094d9dfb353a3772" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_devices" ADD CONSTRAINT "FK_28bd79e1b3f7c1168f0904ce241" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "user_devices" DROP CONSTRAINT "FK_28bd79e1b3f7c1168f0904ce241"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_devices" DROP CONSTRAINT "FK_7c0755b2e06094d9dfb353a3772"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_detail" DROP CONSTRAINT "FK_1332c28a349b7068c659d7923f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_delivery_address" DROP CONSTRAINT "FK_50f617f51944615311a1ad54924"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_delivery_address" DROP CONSTRAINT "FK_3b7be5a76d4793e32c94f5a3abb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_delivery_address" DROP CONSTRAINT "FK_d05d385566330edecc627a174a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_profile" DROP CONSTRAINT "FK_24a36232144a72be5cb4ff61cd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_profile" DROP CONSTRAINT "FK_61c63605b17c73230c2c43691c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_user_favorites" DROP CONSTRAINT "FK_0235676d1d86650aa7ebfd5e2b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2c_user_favorites" DROP CONSTRAINT "FK_18cb4b64b46e362d4d823b3db5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2b_profile" DROP CONSTRAINT "FK_e6d2c097b6e4a947f3bb0ada489"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_fee" DROP CONSTRAINT "FK_d65961bfb7279d25b7e41a67bf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" DROP CONSTRAINT "FK_20dc9f8d86616620881be140833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_d0158ce1ea156acae12df627894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" DROP CONSTRAINT "FK_013745f31593970f8b6f412388a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" DROP CONSTRAINT "FK_4bd9bc00776919370526766eb43"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletion_reason"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_type"`);
    await queryRunner.query(`DROP TYPE "public"."user_user_type_enum"`);
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
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28bd79e1b3f7c1168f0904ce24"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7c0755b2e06094d9dfb353a377"`,
    );
    await queryRunner.query(`DROP TABLE "user_devices"`);
    await queryRunner.query(`DROP TABLE "subscription_detail"`);
    await queryRunner.query(
      `DROP TYPE "public"."subscription_detail_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."subscription_detail_subscription_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "b2c_delivery_address"`);
    await queryRunner.query(`DROP TABLE "b2c_profile"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "b2c_user_favorites"`);
    await queryRunner.query(
      `DROP TYPE "public"."b2c_user_favorites_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."b2c_user_favorites_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "b2b_profile"`);
    await queryRunner.query(
      `DROP TYPE "public"."b2b_profile_profile_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "user_fee"`);
    await queryRunner.query(`DROP TYPE "public"."user_fee_fee_type_enum"`);
    await queryRunner.query(`DROP TABLE "verification_code"`);
    await queryRunner.query(
      `DROP TYPE "public"."verification_code_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "access_token"`);
    await queryRunner.query(`DROP TABLE "device"`);
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
