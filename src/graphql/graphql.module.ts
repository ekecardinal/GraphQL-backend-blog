import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { UserResolver } from 'src/user/user.resolver';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'), // This points to the 'public' folder where your static files are located
    //   serveRoot: '/', // This means files will be available under 'http://localhost:3001/files/'
    // }),
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    // PostModule,
    // CommentModule,
    // LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserResolver, UserService, PrismaService],
})
export class GraphqlModule {}
