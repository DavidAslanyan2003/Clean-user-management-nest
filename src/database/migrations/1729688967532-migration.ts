import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729688967532 implements MigrationInterface {
  name = 'Migration1729688967532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_token" DROP CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" DROP CONSTRAINT "FK_2bb58606078cbef34df6f8a05e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_b38c8203d43a8d64ab42e80453f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" DROP CONSTRAINT "FK_9d714363703b95d7bb9a9be0248"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" RENAME COLUMN "userId" TO "user_id"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_fee_fee_type_enum" AS ENUM()`,
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
      `CREATE TYPE "public"."subscription_detail_subscription_type_enum" AS ENUM('free', 'per event', 'premium', 'enterprise')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_detail_status_enum" AS ENUM('active', 'inactive', 'expired')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription_detail" ("id" SERIAL NOT NULL, "subscription_type" "public"."subscription_detail_subscription_type_enum" NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "status" "public"."subscription_detail_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "b2b_profile_id" uuid, CONSTRAINT "REL_1332c28a349b7068c659d7923f" UNIQUE ("b2b_profile_id"), CONSTRAINT "PK_3efb4c9a07a798f168416cb2b18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_8e1f623798118e629b46a9e6299"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_type"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletion_reason"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "access_token" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "access_token" DROP COLUMN "deviceId"`,
    );
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "deviceId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "access_token" ADD "user_id" uuid`);
    await queryRunner.query(`ALTER TABLE "access_token" ADD "device_id" uuid`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD "user_id" uuid`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD "device_id" uuid`);
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
      `ALTER TABLE "user" ADD "user_type" character varying(255) NOT NULL`,
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
      `ALTER TABLE "user_fee" ADD CONSTRAINT "FK_d65961bfb7279d25b7e41a67bf4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" ADD CONSTRAINT "FK_20dc9f8d86616620881be140833" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2b_profile" ADD CONSTRAINT "FK_e6d2c097b6e4a947f3bb0ada489" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_detail" ADD CONSTRAINT "FK_1332c28a349b7068c659d7923f2" FOREIGN KEY ("b2b_profile_id") REFERENCES "b2b_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "subscription_detail" DROP CONSTRAINT "FK_1332c28a349b7068c659d7923f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "b2b_profile" DROP CONSTRAINT "FK_e6d2c097b6e4a947f3bb0ada489"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" DROP CONSTRAINT "FK_20dc9f8d86616620881be140833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_fee" DROP CONSTRAINT "FK_d65961bfb7279d25b7e41a67bf4"`,
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
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "device_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" DROP COLUMN "device_id"`,
    );
    await queryRunner.query(`ALTER TABLE "access_token" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD "deviceId" uuid`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "access_token" ADD "deviceId" uuid`);
    await queryRunner.query(`ALTER TABLE "access_token" ADD "userId" uuid`);
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
      `ALTER TABLE "user" ADD "user_type" character varying(255) NOT NULL`,
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
      `ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "subscription_detail"`);
    await queryRunner.query(
      `DROP TYPE "public"."subscription_detail_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."subscription_detail_subscription_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "b2b_profile"`);
    await queryRunner.query(
      `DROP TYPE "public"."b2b_profile_profile_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "user_fee"`);
    await queryRunner.query(`DROP TYPE "public"."user_fee_fee_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "verification_code" RENAME COLUMN "user_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" ADD CONSTRAINT "FK_9d714363703b95d7bb9a9be0248" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_b38c8203d43a8d64ab42e80453f" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" ADD CONSTRAINT "FK_2bb58606078cbef34df6f8a05e9" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" ADD CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
