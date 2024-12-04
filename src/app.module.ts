import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.model';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/posts.model';
import { Dialect } from 'sequelize';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SequelizeModule.forRoot({
      dialect: <Dialect>'postgres',
      protocol: 'postgres',
      // ssl: Boolean(process.env.SSL),
      dialectOptions: {
        ssl: Boolean(process.env.SSL) ? true : false,
      },
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRESS_PASSWORD),
      database: String(process.env.POSTGRES_DB),
      models: [User, Post],
      autoLoadModels: true,
    }),

    UserModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
