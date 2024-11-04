import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTeamTable1730652472384 implements MigrationInterface {
  name = 'UpdateTeamTable1730652472384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61"
        `);
    await queryRunner.query(`
            CREATE TABLE "teams" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL DEFAULT 'system',
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL DEFAULT 'system',
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61"
        `);
    await queryRunner.query(`
            DROP TABLE "teams"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
