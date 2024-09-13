import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LikeType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  postId: string;
}
