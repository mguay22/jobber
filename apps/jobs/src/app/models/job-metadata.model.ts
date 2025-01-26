import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JobMetadata {
  @Field()
  name: string;

  @Field()
  description: string;
}
