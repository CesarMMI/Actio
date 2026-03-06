import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1772827184423 implements MigrationInterface {
  name = 'Initial1772827184423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "captured_items" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "title" varchar NOT NULL, "notes" text, "status" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "description" text, "status" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contexts" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "description" text, "active" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "actions" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "title" varchar NOT NULL, "notes" text, "dueDate" datetime, "timeBucket" varchar, "energyLevel" varchar, "projectId" varchar, "contextId" varchar, "status" varchar NOT NULL, "completedAt" datetime, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_captured_items" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "title" varchar NOT NULL, "notes" text, "status" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_8e7e42a457b63c76faee1d003be" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_captured_items"("id", "userId", "title", "notes", "status", "createdAt", "updatedAt") SELECT "id", "userId", "title", "notes", "status", "createdAt", "updatedAt" FROM "captured_items"`,
    );
    await queryRunner.query(`DROP TABLE "captured_items"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_captured_items" RENAME TO "captured_items"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_projects" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "description" text, "status" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_projects"("id", "userId", "name", "description", "status", "createdAt", "updatedAt") SELECT "id", "userId", "name", "description", "status", "createdAt", "updatedAt" FROM "projects"`,
    );
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_projects" RENAME TO "projects"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_contexts" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "description" text, "active" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_5de328bcdf55bbbeb83e1b266ce" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_contexts"("id", "userId", "name", "description", "active", "createdAt", "updatedAt") SELECT "id", "userId", "name", "description", "active", "createdAt", "updatedAt" FROM "contexts"`,
    );
    await queryRunner.query(`DROP TABLE "contexts"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_contexts" RENAME TO "contexts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_actions" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "title" varchar NOT NULL, "notes" text, "dueDate" datetime, "timeBucket" varchar, "energyLevel" varchar, "projectId" varchar, "contextId" varchar, "status" varchar NOT NULL, "completedAt" datetime, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_83a262823d7b54757fa07171b90" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_bf19986daa290f9e308ee719217" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_4581785132ad049b6d7143cbb1c" FOREIGN KEY ("contextId") REFERENCES "contexts" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_actions"("id", "userId", "title", "notes", "dueDate", "timeBucket", "energyLevel", "projectId", "contextId", "status", "completedAt", "createdAt") SELECT "id", "userId", "title", "notes", "dueDate", "timeBucket", "energyLevel", "projectId", "contextId", "status", "completedAt", "createdAt" FROM "actions"`,
    );
    await queryRunner.query(`DROP TABLE "actions"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_actions" RENAME TO "actions"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "actions" RENAME TO "temporary_actions"`,
    );
    await queryRunner.query(
      `CREATE TABLE "actions" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "title" varchar NOT NULL, "notes" text, "dueDate" datetime, "timeBucket" varchar, "energyLevel" varchar, "projectId" varchar, "contextId" varchar, "status" varchar NOT NULL, "completedAt" datetime, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "actions"("id", "userId", "title", "notes", "dueDate", "timeBucket", "energyLevel", "projectId", "contextId", "status", "completedAt", "createdAt") SELECT "id", "userId", "title", "notes", "dueDate", "timeBucket", "energyLevel", "projectId", "contextId", "status", "completedAt", "createdAt" FROM "temporary_actions"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_actions"`);
    await queryRunner.query(
      `ALTER TABLE "contexts" RENAME TO "temporary_contexts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "contexts" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "description" text, "active" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "contexts"("id", "userId", "name", "description", "active", "createdAt", "updatedAt") SELECT "id", "userId", "name", "description", "active", "createdAt", "updatedAt" FROM "temporary_contexts"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_contexts"`);
    await queryRunner.query(
      `ALTER TABLE "projects" RENAME TO "temporary_projects"`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "description" text, "status" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "projects"("id", "userId", "name", "description", "status", "createdAt", "updatedAt") SELECT "id", "userId", "name", "description", "status", "createdAt", "updatedAt" FROM "temporary_projects"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_projects"`);
    await queryRunner.query(
      `ALTER TABLE "captured_items" RENAME TO "temporary_captured_items"`,
    );
    await queryRunner.query(
      `CREATE TABLE "captured_items" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "title" varchar NOT NULL, "notes" text, "status" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "captured_items"("id", "userId", "title", "notes", "status", "createdAt", "updatedAt") SELECT "id", "userId", "title", "notes", "status", "createdAt", "updatedAt" FROM "temporary_captured_items"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_captured_items"`);
    await queryRunner.query(`DROP TABLE "actions"`);
    await queryRunner.query(`DROP TABLE "contexts"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "captured_items"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
