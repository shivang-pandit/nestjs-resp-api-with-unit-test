import { Test } from "@nestjs/testing"
import { Connection, isValidObjectId } from "mongoose"
import { UserResponse } from '../../users.interface';
import * as request from 'supertest';

import { AppModule } from "../../../app.module";
import { DatabaseService } from "../../../database/database.service";
import { RegisterUserDto } from "../../dto/register-user.dto";
import { userStub } from "../stubs/user.stub";

describe('UsersController', () => {
  let dbConnection: Connection;
  let app: any;

  const createUserRequest: RegisterUserDto = {
    first_name: userStub().first_name,
    last_name: userStub().last_name,
    user_name: userStub().user_name,
    email: userStub().email,
    password: userStub().password,
    confirm_password: userStub().password,
  }

  const userResponse: UserResponse = {
    message: 'User registered successfully',
    payload: {
      id: 'st1',
      first_name: createUserRequest.first_name,
      last_name: createUserRequest.last_name,
      user_name: createUserRequest.user_name,
      email: createUserRequest.email,
      active: true
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
  },30000)

  afterAll(async () => {
    await app.close();
  })

  describe('/api/users/register (post)', () => {
    it('should register new user', async () => {
      expect.assertions(4);
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(createUserRequest)

      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.payload.email).toEqual(createUserRequest.email);
      expect(response.body.payload.user_name).toEqual(createUserRequest.user_name);
    })

    it('if username is already existed', async () => {
      expect.assertions(2);
      const res = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          first_name: userStub().first_name,
          last_name: userStub().last_name,
          user_name: userStub().user_name,
          email: userStub().email,
          password: userStub().password,
          confirm_password: userStub().password,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('Username already exist!');
    });

    it('if email is already existed', async () => {
      expect.assertions(2);
      const res = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          first_name: userStub().first_name,
          last_name: userStub().last_name,
          user_name: userStub().user_name + 'exp',
          email: userStub().email,
          password: userStub().password,
          confirm_password: userStub().password,
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('Email already exist!');
    });
  })

  describe('/api/users/login (post)', () => {
    let token: string;
    it('Invalid login attempt ', async () => {
      expect.assertions(1);

      let badRequest = await request(app.getHttpServer()).post('/users/login').send({
        user_name: "shivang",
        password: "testT@1234"
      })

      expect(badRequest.body.statusCode).toBe(404)
    });

    it('Should login user and return JWT Token ', async () => {
      expect.assertions(3);
      const response = await request(app.getHttpServer()).post('/users/login').send({
        user_name: createUserRequest.user_name,
        password: createUserRequest.password
      })      
      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('User login successfully')
      token = response.body.payload.token
    })

    it('Get user profile by using login invalid token!', async () => {
      expect.assertions(1);
      const badToken = await request(app.getHttpServer()).get('/users/profile').set('auth_token', "bad_token");
      expect(badToken.body.statusCode).toBe(401); // Unauthorized
    })

    it('Get user profile by using login token!', async () => {
      expect.assertions(2);
      
      const userProfile = await request(app.getHttpServer()).get('/users/profile').set('auth_token', token)
      expect(userProfile.body.payload.email).toEqual(createUserRequest.email);
      expect(userProfile.body.payload.user_name).toEqual(createUserRequest.user_name);
      await dbConnection.collection('users').deleteOne({ user_name: userProfile.body.payload.user_name })
    })
  })
})