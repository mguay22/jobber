CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text,
	"price" integer,
	"stock" integer,
	"rating" integer,
	"description" text
);
