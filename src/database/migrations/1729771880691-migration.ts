import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729771880691 implements MigrationInterface {
  name = 'Migration1729771880691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed"`,
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
      `CREATE TABLE "country" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2c5aa339240c0c3ae97fcc9dc4c" UNIQUE ("name"), CONSTRAINT "UQ_8ff4c23dc9a3f3856555bd86186" UNIQUE ("code"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "b2c_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "loyalty_points" integer NOT NULL DEFAULT '0', "upcoming_events_count" integer NOT NULL DEFAULT '0', "following_list" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "delivery_id" uuid, CONSTRAINT "REL_61c63605b17c73230c2c43691c" UNIQUE ("user_id"), CONSTRAINT "PK_03b242515fc89f86eedae206a50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "b2c_delivery_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(255) NOT NULL, "state" character varying(255), "postal_code" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "b2c_profile_id" uuid, "country_id" uuid, "city_id" uuid, CONSTRAINT "PK_151a9b94fce4fb359158c666870" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletion_reason"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
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
    await queryRunner.query(`ALTER TABLE "user_fee" DROP COLUMN "fee_type"`);
    await queryRunner.query(
      `ALTER TABLE "user_fee" ADD "fee_type" "public"."user_fee_fee_type_enum" NOT NULL`,
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
    await queryRunner.query(`ALTER TABLE "user_fee" DROP COLUMN "fee_type"`);
    await queryRunner.query(
      `ALTER TABLE "user_fee" ADD "fee_type" user_fee_fee_type_enum NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletion_reason"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
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
      `ALTER TABLE "user" ADD "user_type" character varying(255) NOT NULL`,
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
      `ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "b2c_delivery_address"`);
    await queryRunner.query(`DROP TABLE "b2c_profile"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "b2c_user_favorites"`);
    await queryRunner.query(
      `DROP TYPE "public"."b2c_user_favorites_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."b2c_user_favorites_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_5ec8c5775ab43ef27089ed84fed" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_f8f1135a6f13571fe33d7f982f5" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
