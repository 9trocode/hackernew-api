import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });


  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/hackernews/commonWords?stories=25')
      .expect(200)
      .expect({
            code: 200,
            status: true,
            data: [
              { key: 'for', value: 5 },
              { key: 'to', value: 5 },
              { key: 'a', value: 4 },
              { key: 'hn', value: 3 },
              { key: 'and', value: 3 },
              { key: 'with', value: 3 },
              { key: 'in', value: 3 },
              { key: 'm', value: 3 },
              { key: 'show', value: 2 },
              { key: 'an', value: 2 }
            ]
          }
      );
  });
});
