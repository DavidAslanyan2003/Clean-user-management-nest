import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1723794981696 implements MigrationInterface {
  name = 'Migration1723794981696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FAQ" DROP CONSTRAINT "FK_bfff0325eeaef01a3238efc1424"`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" DROP CONSTRAINT "FK_6961dd3fbec0a9010d5d9fec3e5"`
    );
    await queryRunner.query(`ALTER TABLE "FAQ" DROP COLUMN "event_info_id"`);
    await queryRunner.query(
      `ALTER TABLE "FAQ" DROP COLUMN "updated_event_info_id"`
    );
    await queryRunner.query(`ALTER TABLE "FAQ" ADD "event_id" uuid`);
    await queryRunner.query(`ALTER TABLE "FAQ" ADD "updated_event_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "FAQ" ADD CONSTRAINT "FK_59e137de805b3d00786a3928a5f" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" ADD CONSTRAINT "FK_6ccf42540ab95971d55feec24d5" FOREIGN KEY ("updated_event_id") REFERENCES "update-event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FAQ" DROP CONSTRAINT "FK_6ccf42540ab95971d55feec24d5"`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" DROP CONSTRAINT "FK_59e137de805b3d00786a3928a5f"`
    );
    await queryRunner.query(`ALTER TABLE "FAQ" DROP COLUMN "updated_event_id"`);
    await queryRunner.query(`ALTER TABLE "FAQ" DROP COLUMN "event_id"`);
    await queryRunner.query(
      `ALTER TABLE "FAQ" ADD "updated_event_info_id" uuid`
    );
    await queryRunner.query(`ALTER TABLE "FAQ" ADD "event_info_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "FAQ" ADD CONSTRAINT "FK_6961dd3fbec0a9010d5d9fec3e5" FOREIGN KEY ("updated_event_info_id") REFERENCES "updated_event_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "FAQ" ADD CONSTRAINT "FK_bfff0325eeaef01a3238efc1424" FOREIGN KEY ("event_info_id") REFERENCES "event_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
