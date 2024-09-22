import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ExecuteJobInput {
  @Field()
  @IsNotEmpty()
  name: string;
}
