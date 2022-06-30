import { Test, TestingModule } from '@nestjs/testing';
import { ResponseProvider } from '../../../providers/ResponseProvider';
import { RegisterUserDto } from '../../dto/register-user.dto';
import { UsersController } from '../../users.controller';
import { UsersService } from '../../users.service';
import { UserLogin, UserResponse } from '../../users.interface';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { userStub } from '../stubs/user.stub';
import { userLoginStub } from '../stubs/user_login.stub';

jest.mock('../../users.service')

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let responseProvider: ResponseProvider;
  let userModel: Model<User>;
  const UserRegisterInput: RegisterUserDto = {
    first_name: userStub().first_name,
    last_name: userStub().last_name,
    user_name: userStub().user_name,
    email: userStub().email,
    password: userStub().password,
    confirm_password: userStub().password
  }

  const UserRegisterResponse = {
    ...UserRegisterInput,
  }

  const UserLoginResponse = {
    token: userLoginStub().token
  }

  const UserProfileResponse = {
    first_name: userStub().first_name,
    last_name: userStub().last_name,
    user_name: userStub().user_name,
    email: userStub().email,
    active: userStub().active,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        ResponseProvider,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    responseProvider = module.get<ResponseProvider>(ResponseProvider);

    // Clear a mocks before each test.
    jest.clearAllMocks();
  });

  it('Check controller, service and response should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined()
    expect(responseProvider).toBeDefined()
  });

  describe('UserController : register', () => {
    let user: UserResponse
    beforeEach(async () => {
      user = await controller.register(UserRegisterInput);
    })

    it('It should call userService(findByParams) to check user_name exist or not.', async () => {
      expect(service.findByParams).toBeCalledWith(
        expect.objectContaining({
          user_name: UserRegisterInput.user_name
        })
      )
    })

    it('It should call userService(findByParams) to check email exist or not.', async () => {
      expect(service.findByParams).toBeCalledWith(
        expect.objectContaining({
          email: UserRegisterInput.email
        })
      )
    })

    it('Register new user', () => {
      expect(service.create).toHaveBeenCalledWith(UserRegisterInput);
    })

    it('then it should return a newly registered user', async () => {
      delete UserRegisterResponse.confirm_password;
      const userRegisterResponse = responseProvider.success(
        'User registered successfully',
        UserRegisterResponse,
      )      
      expect(user).toMatchObject(userRegisterResponse)
    })
  })

  describe('UserController : login', () => {
    let user: UserLogin
    beforeEach(async () => {
      user = await controller.login({
        user_name: UserRegisterInput.user_name,
        password: UserRegisterInput.password
      });
    })

    it('It should call userService(verifyLogin) to check user_name and password are valid or not.', async () => {
      expect(service.verifyLogin).toBeCalledWith(
        expect.objectContaining({
          user_name: UserRegisterInput.user_name,
          password: UserRegisterInput.password
        })
      )
    })

    it('then it should login return a JWT token for that user', async () => {      
      const userLoginResponse = responseProvider.success(
        'User login successfully',
        UserLoginResponse,
      )      
      expect(user).toEqual(userLoginResponse)
    })
  })

  describe('UserController : profile', () => {
    let user: UserResponse
    beforeEach(async () => {
      user = await controller.profile("1");
    })

    it('By using user id from jwt token it should call userService(findById) to get user details!', async () => {
      expect(service.findById).toBeCalledWith("1")
    })

    it('It should return user profile details', async () => {      
      const userLoginResponse = responseProvider.success(
        'User Profile!',
        UserProfileResponse,
      )      
      expect(user).toMatchObject(userLoginResponse)
    })
  })
});
