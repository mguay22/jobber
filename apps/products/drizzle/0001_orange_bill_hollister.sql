CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"charge" integer,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
