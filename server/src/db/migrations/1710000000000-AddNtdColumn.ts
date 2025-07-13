import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNtdColumn1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "question" 
            ADD COLUMN IF NOT EXISTS "ntd" character varying;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "question" 
            DROP COLUMN IF EXISTS "ntd";
        `);
    }
} 