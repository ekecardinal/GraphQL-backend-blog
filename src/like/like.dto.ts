import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LikeCreateInput {
  @Field()
  postId: string;

  @Field()
  userId: string;
}
