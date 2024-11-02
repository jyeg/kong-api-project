import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1730575653752 implements MigrationInterface {
    name = 'InitTables1730575653752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "versions" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL DEFAULT 'system',
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL DEFAULT 'system',
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "service_id" uuid NOT NULL,
                "version" integer NOT NULL,
                "release_date" date,
                "changelog" jsonb NOT NULL DEFAULT '{}',
                "documentation_url" character varying(255),
                "is_active" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_921e9a820c96cc2cd7d4b3a107b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_UNIQUE_ACTIVE_VERSION" ON "versions" ("service_id", "is_active")
            WHERE is_active = true
        `);
        await queryRunner.query(`
            CREATE TABLE "service_groups" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL DEFAULT 'system',
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL DEFAULT 'system',
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "user_id" uuid NOT NULL,
                "tags" text,
                CONSTRAINT "PK_c541600efebc3f4fefd3d082ef3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL DEFAULT 'system',
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL DEFAULT 'system',
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "password_hash" character varying NOT NULL,
                "roles" text NOT NULL,
                "team_id" uuid NOT NULL,
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "team" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL DEFAULT 'system',
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL DEFAULT 'system',
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "versions"
            ADD CONSTRAINT "FK_961b0fd5ea2634e21a6ef6faed7" FOREIGN KEY ("service_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "service_groups"
            ADD CONSTRAINT "FK_3c68de0035b536158431de9945b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61"
        `);
        await queryRunner.query(`
            ALTER TABLE "service_groups" DROP CONSTRAINT "FK_3c68de0035b536158431de9945b"
        `);
        await queryRunner.query(`
            ALTER TABLE "versions" DROP CONSTRAINT "FK_961b0fd5ea2634e21a6ef6faed7"
        `);
        await queryRunner.query(`
            DROP TABLE "team"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "service_groups"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_UNIQUE_ACTIVE_VERSION"
        `);
        await queryRunner.query(`
            DROP TABLE "versions"
        `);
    }

}
