import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVersion1730579563923 implements MigrationInterface {
    name = 'UpdateVersion1730579563923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "versions" DROP CONSTRAINT "FK_961b0fd5ea2634e21a6ef6faed7"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_UNIQUE_ACTIVE_VERSION"
        `);
        await queryRunner.query(`
            ALTER TABLE "versions"
                RENAME COLUMN "service_id" TO "service_group_id"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_UNIQUE_ACTIVE_VERSION" ON "versions" ("service_group_id", "is_active")
            WHERE is_active = true
        `);
        await queryRunner.query(`
            ALTER TABLE "versions"
            ADD CONSTRAINT "FK_97e10342341211cff0de279ce9e" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "versions" DROP CONSTRAINT "FK_97e10342341211cff0de279ce9e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_UNIQUE_ACTIVE_VERSION"
        `);
        await queryRunner.query(`
            ALTER TABLE "versions"
                RENAME COLUMN "service_group_id" TO "service_id"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_UNIQUE_ACTIVE_VERSION" ON "versions" ("is_active", "service_id")
            WHERE (is_active = true)
        `);
        await queryRunner.query(`
            ALTER TABLE "versions"
            ADD CONSTRAINT "FK_961b0fd5ea2634e21a6ef6faed7" FOREIGN KEY ("service_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
