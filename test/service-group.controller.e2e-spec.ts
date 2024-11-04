import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';

describe('ServiceGroupController (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  let authToken: string;
  let userId: string;
  let serviceGroupId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();

    // Create a valid user and generate a token for authentication
    const loginDto = {
      email: 'alice@example.com', // Use the seeded user's email
      password: 'password123', // Use the seeded user's password
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    authToken = response.body.access_token;
    userId = response.body.user.id;
    // get one service group to use for testing
    const serviceGroupResponse = await request(app.getHttpServer())
      .get(`/service-group`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    serviceGroupId = serviceGroupResponse.body.items[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /service-group', () => {
    it('should create a new service group', async () => {
      const createDto = {
        name: 'New Service',
        description: 'New Service Description',
        tags: ['new', 'service'],
      };

      const response = await request(app.getHttpServer())
        .post('/service-group')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createDto.name);
      expect(response.body.description).toBe(createDto.description);
      expect(response.body.userId).toBe(userId);
    });
  });

  describe('GET /service-group', () => {
    it('should return paginated service groups', async () => {
      const response = await request(app.getHttpServer())
        .get('/service-group')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.total).toBeDefined();
      expect(response.body.total).toBeGreaterThanOrEqual(8);
    });
  });

  describe('GET /service-group/:id', () => {
    it('should return a single service group', async () => {
      const response = await request(app.getHttpServer())
        .get(`/service-group/${serviceGroupId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', serviceGroupId);
    });

    it('should return 404 when service group not found', async () => {
      const nonexistentId = uuidv4();

      await request(app.getHttpServer())
        .get(`/service-group/${nonexistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PATCH /service-group/:id', () => {
    it('should update a service group', async () => {
      const updateDto = {
        name: 'Updated Service',
      };

      const response = await request(app.getHttpServer())
        .patch(`/service-group/${serviceGroupId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', serviceGroupId);
      expect(response.body.name).toBe(updateDto.name);
    });
  });
});
