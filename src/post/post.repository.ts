import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./post.entity";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostRepository {
    private posts: Post[] = [];
    private idCounter = 1;

    find(): Post[] {
        return this.posts;
    }

    findOne({ where: { id } }: { where: { id: number } }): Post | null {
        return this.find().find(post => post.id === id) || null;
    }

    create(createaPostDto: CreatePostDto): Post {
        const newPost = this.createPost(createaPostDto);
        this.posts.push(newPost);
        return newPost;
    }

    save(post: Post): Post {
        const index = this.posts.findIndex(({ id }) => id === post.id);

        if (index === -1) {
            this.posts.push(post);
            return post;
        }

        this.posts[index] = post;
        return post;
    }

    update(id: number, updateDto: UpdatePostDto): void {
        this.posts.forEach(post => {
            if(post.id === id) {
                post.title = updateDto.title ?? post.title;
                post.content = updateDto.content ?? post.content;
                post.authorId = updateDto.authorId ?? post.authorId;
            }
        });
    }

    delete(id: number): void {
        this.posts = this.posts.filter(({ id: postId }) => postId !== id);
    }

    private createPost(createPostDto:CreatePostDto): Post {
        return new Post(
            this.idCounter++,
            createPostDto.title,
            createPostDto.content,
            createPostDto.authorId
        )
    }

}