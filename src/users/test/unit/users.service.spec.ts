import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from '../../users.service';
import { userStub } from '../stubs/user.stub';
import { userLoginStub } from '../stubs/user_login.stub';
import { UserDocument } from '../../schemas/user.schema';
jest.mock('../../users.service')

describe('UsersService', () => {
  let service: UsersService;
  const UserRegisterInput: RegisterUserDto = {
    first_name: userStub().first_name,
    last_name: userStub().last_name,
    user_name: userStub().user_name,
    email: userStub().email,
    password: userStub().password,
    confirm_password: userStub().password
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
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UserService : create', () => {
    it('Its create new user',async ()  => {      
      expect.assertions(2);
      const user = await service.create(UserRegisterInput);      
      expect(service.create).toHaveBeenCalledWith(UserRegisterInput);
      expect(user).toEqual(userStub())
    });
  });
  
  describe('UserService : verifyLogin', () => {
    it('Its verify user login.',async ()  => {      
      expect.assertions(2);
      const user = await service.verifyLogin(userLoginStub());      
      expect(service.verifyLogin).toHaveBeenCalledWith(userLoginStub());
      expect(user).toEqual(userStub())
    });
  });

  describe('UserService : verifyLogin', () => {
    it('Its verify user login.',async ()  => {      
      expect.assertions(2);
      const user = await service.verifyLogin(userLoginStub());            
      expect(service.verifyLogin).toHaveBeenCalledWith(userLoginStub());
      expect(user).toEqual(userStub())
    });
  });

  describe('UserService : findByParams', () => {
    it('Its find user by params.',async ()  => {      
      expect.assertions(1);      
      const user = await service.findByParams(userLoginStub());                  
      expect(service.findByParams).toHaveBeenCalledWith(userLoginStub());
      
    });
  });

  describe('UserService : getJwtToken', () => {
    it('Its return JWT token.',async ()  => {      
      expect.assertions(2);
      const user = await service.getJwtToken(userStub() as UserDocument);                        
      expect(service.getJwtToken).toHaveBeenCalledWith(userStub());
      expect(user).toEqual(userLoginStub().token)
    });
  });

  describe('UserService : findById', () => {
    it('Its find user details by id.',async ()  => {      
      expect.assertions(2);
      const user = await service.findById("id");                        
      expect(service.findById).toHaveBeenCalledWith("id");
      expect(user).toEqual(userStub())
    });
  });

  describe('UserService : updateLoginAttempts', () => {
    it('Its update user login attempts.',async ()  => {      
      expect.assertions(2);
      const user = await service.updateLoginAttempts(userStub().user_name);                        
      expect(service.updateLoginAttempts).toHaveBeenCalledWith(userStub().user_name);
      expect(user).toEqual(userStub())
    });
  });
});
