import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1730468162631 implements MigrationInterface {
  name = 'InitTables1730468162631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "password_hash" character varying NOT NULL,
                "roles" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "team" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "service_groups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "tags" text,
                "status" character varying(50),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "team_id" uuid,
                CONSTRAINT "PK_c541600efebc3f4fefd3d082ef3" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "versions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "version_number" character varying(50) NOT NULL,
                "release_date" date,
                "changelog" text,
                "documentation_url" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "service_id" uuid,
                CONSTRAINT "PK_921e9a820c96cc2cd7d4b3a107b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_teams" (
                "user_id" uuid NOT NULL,
                "team_id" uuid NOT NULL,
                CONSTRAINT "PK_73a4ff91e5f6ff3eae7356555ab" PRIMARY KEY ("user_id", "team_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ee838ec2b13ac600a162c20ce3" ON "user_teams" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_006715ef1e1b40852f379efe56" ON "user_teams" ("team_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "service_groups"
            ADD CONSTRAINT "FK_6a9de06b82489723910a7f94ce1" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "versions"
            ADD CONSTRAINT "FK_961b0fd5ea2634e21a6ef6faed7" FOREIGN KEY ("service_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_teams"
            ADD CONSTRAINT "FK_ee838ec2b13ac600a162c20ce33" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_teams"
            ADD CONSTRAINT "FK_006715ef1e1b40852f379efe567" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_teams" DROP CONSTRAINT "FK_006715ef1e1b40852f379efe567"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_teams" DROP CONSTRAINT "FK_ee838ec2b13ac600a162c20ce33"
        `);
    await queryRunner.query(`
            ALTER TABLE "versions" DROP CONSTRAINT "FK_961b0fd5ea2634e21a6ef6faed7"
        `);
    await queryRunner.query(`
            ALTER TABLE "service_groups" DROP CONSTRAINT "FK_6a9de06b82489723910a7f94ce1"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_006715ef1e1b40852f379efe56"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ee838ec2b13ac600a162c20ce3"
        `);
    await queryRunner.query(`
            DROP TABLE "user_teams"
        `);
    await queryRunner.query(`
            DROP TABLE "versions"
        `);
    await queryRunner.query(`
            DROP TABLE "service_groups"
        `);
    await queryRunner.query(`
            DROP TABLE "team"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
