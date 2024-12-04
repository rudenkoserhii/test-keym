import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post) {}
  async getAllPosts() {
    const posts = await this.postRepository.findAll({ include: { all: true } });
    return posts;
  }
}
