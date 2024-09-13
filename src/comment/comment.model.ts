import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostType } from 'src/post/post.type';
import { User } from 'src/user/user.model';

@ObjectType()
export class Comment {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  postId: string;

  @Field((type) => User)
  user: User;

  // Assuming Post model exists
  @Field((type) => PostType)
  post: PostType;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
