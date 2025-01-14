import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Job {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  size: number;

  @Field()
  completed: number;

  @Field()
  status: string;

  @Field()
  started: Date;

  @Field({ nullable: true })
  ended?: Date;
}
