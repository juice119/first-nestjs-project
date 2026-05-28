import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PostModule } from './post/post.module';

@Module({
  imports: [PostModule],
})
export class AppModule{}