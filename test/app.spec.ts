import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CreatePostDto } from '../src/post/dto/create-post.dto';
import { PostModule } from '../src/post/post.module';
import { faker } from '@faker-js/faker/locale/ko';

describe('PostController (e2e)', () => {
  let app: INestApplication<App>;
  let httpServer: ReturnType<typeof request>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = request(app.getHttpServer());
  });

  it('글 리스트를 가져올 수 있다.GET /posts', async () => {
    // given
    const posts = [createPostDto(), createPostDto()];

    // when
    await Promise.all(
      posts.map((post) => writePost(httpServer, post)),
    );
    const response = await httpServer.get('/posts');

    // then
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining(
        posts.map((post) => expect.objectContaining(post)),
      ),
    );
  });

  it('게시글을 작성할 수 잇다. POST /posts', async () => {
    // given
    const payload = {
      title: faker.book.title(),
      content: faker.lorem.lines({ min: 1, max: 4 }),
      authorId: faker.number.int(),
    };

    // when
    const response = await httpServer.post('/posts').send(payload).expect(201);

    //then
    expect(response.body).toMatchObject(payload);
    expect(response.body).toEqual(expect.objectContaining(payload));
  });

  it('게시글을 수정할 수 잇다. PUT /posts/:id', async () => {
    // given
    const postId = (await writePost(httpServer,createPostDto())).id;
    const payload = {
      title: faker.book.title(),
      content: faker.lorem.lines({ min: 1, max: 4 }),
    };

    // when
    const response = await httpServer.put(`/posts/${postId}`).send(payload).expect(200);

    //then
    expect(response.body).toMatchObject(payload);
    expect(response.body).toEqual(expect.objectContaining(payload));
  });

  it('게시글을 삭제할 수 있다. DELETE /posts/:id', async () => {
    // given
    const postId = (await writePost(httpServer, createPostDto())).id;

    // when
    await httpServer.delete(`/posts/${postId}`).expect(200);

    // then
    const listResponse = await httpServer.get('/posts').expect(200);
    expect(listResponse.body.some((post: { id: number }) => post.id === postId)).toBe(
      false,
    );
  });

  it('full flow: create -> get -> update -> delete', async () => {
    const created = await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 't2', content: 'c2', authorId: 2 })
      .expect(201);

    const id = created.body.id as number;

    const fetched = await request(app.getHttpServer())
      .get(`/posts/${id}`)
      .expect(200);
    expect(fetched.body).toMatchObject({
      id,
      title: 't2',
      content: 'c2',
      authorId: 2,
    });

    const updated = await request(app.getHttpServer())
      .put(`/posts/${id}`)
      .send({ title: 't2-upd' })
      .expect(200);
    expect(updated.body).toMatchObject({
      id,
      title: 't2-upd',
      content: 'c2',
      authorId: 2,
    });

    await request(app.getHttpServer()).delete(`/posts/${id}`).expect(200);

    const afterDelete = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);
    expect(afterDelete.body.some((p: any) => p.id === id)).toBe(false);
  });

  afterAll(async () => {
    await app.close();
  });
});

async function writePost(
  httpServer: ReturnType<typeof request>,
  dto: CreatePostDto,
) {
  return (await httpServer.post('/posts').send(dto).expect(201)).body;
}

function createPostDto(overrides: Partial<CreatePostDto> = {}): CreatePostDto {
  const base: CreatePostDto = {
    title: `title-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    content: `content-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    authorId: Math.floor(Math.random() * 1000) + 1,
  };

  return Object.assign(new CreatePostDto(), base, overrides);
}
