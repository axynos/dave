-- CreateTable
CREATE TABLE "Semester" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMPTZ(6) NOT NULL,
    "end" TIMESTAMPTZ(6) NOT NULL,
    "registrationStart" TIMESTAMPTZ(6) NOT NULL,
    "registrationEnd" TIMESTAMPTZ(6) NOT NULL,
    "academicYear" SMALLINT NOT NULL,
    "code" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructuralUnit" (
    "id" TEXT NOT NULL,
    "nameET" TEXT,
    "nameEN" TEXT,
    "level" SMALLINT NOT NULL,
    "academic" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timetable" (
    "uuid" UUID NOT NULL,
    "titleET" TEXT,
    "titleEN" TEXT,
    "lastUpdate" TIMESTAMPTZ(6) NOT NULL,
    "semesterId" TEXT NOT NULL,
    "structuralUnitId" TEXT NOT NULL,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Lecturer" (
    "uuid" UUID NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "courseUuid" UUID,
    "eventUuid" UUID,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "uuid" UUID NOT NULL,
    "eventUuid" UUID,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Course" (
    "uuid" UUID NOT NULL,
    "state" TEXT NOT NULL,
    "updateAt" TIMESTAMPTZ(6) NOT NULL,
    "code" TEXT NOT NULL,
    "titleET" TEXT,
    "titleEN" TEXT,
    "studyLanguage" TEXT,
    "studyLevel" TEXT,
    "studyType" TEXT,
    "webBased" TEXT,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Event" (
    "uuid" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "description" TEXT,
    "start" TIMESTAMPTZ(6) NOT NULL,
    "end" TIMESTAMPTZ(6) NOT NULL,
    "location" TEXT,
    "registered" INTEGER NOT NULL,
    "courseUuid" UUID NOT NULL,

    PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Timetable" ADD FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD FOREIGN KEY ("structuralUnitId") REFERENCES "StructuralUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecturer" ADD FOREIGN KEY ("courseUuid") REFERENCES "Course"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecturer" ADD FOREIGN KEY ("eventUuid") REFERENCES "Event"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD FOREIGN KEY ("eventUuid") REFERENCES "Event"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("courseUuid") REFERENCES "Course"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
