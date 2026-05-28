import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./post.entity";
import { PostRepository } from "./post.repository";

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository) {}

    async findAll(): Promise<Post[]> {
        return this.postRepository.find();
    }

    async findOne(id: number): Promise<Post | null> {
        return this.postRepository.findOne({ where: { id } });
    }

    async create(createPostDto: CreatePostDto): Promise<Post> {
        return this.postRepository.create(createPostDto);
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<Post | null> {
        await this.postRepository.update(id, updatePostDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.postRepository.delete(id);
    }
    
}