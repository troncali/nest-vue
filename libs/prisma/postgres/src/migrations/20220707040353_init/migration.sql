-- Ensure uuid_generate_v4() function is available when shadow is created
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "user" (
    "dbId" BIGSERIAL NOT NULL,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "user_dbid_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "session" (
    "dbId" BIGSERIAL NOT NULL,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userDbId" BIGINT NOT NULL,

    CONSTRAINT "session_dbid_pkey" PRIMARY KEY ("dbId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_id_key" ON "session"("id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "user_dbid_fkey" FOREIGN KEY ("userDbId") REFERENCES "user"("dbId") ON DELETE CASCADE ON UPDATE NO ACTION;
