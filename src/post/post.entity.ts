export class Post {
    id: number; 
    title: string;
    content: string;
    authorId: number;
    
    constructor(id: number, title: string, content: string, authorId: number) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
    }
}