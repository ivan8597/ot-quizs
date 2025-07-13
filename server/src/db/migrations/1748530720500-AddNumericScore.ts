import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNumericScore1748530720500 implements MigrationInterface {
    name = 'AddNumericScore1748530720500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "score" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "answers"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "answers" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "answers"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "answers" json`);
        await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "result" ADD "score" integer NOT NULL`);
    }

}
