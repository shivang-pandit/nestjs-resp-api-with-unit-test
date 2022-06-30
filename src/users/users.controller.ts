import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseProvider } from '../providers/ResponseProvider';
import { UserLogin, UserResponse } from './users.interface';
import { UserDocument } from './schemas/user.schema';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseProvider: ResponseProvider,
  ) { }

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse()
  @ApiResponse({ description: "User registration" })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserResponse> {
    const userNameExist = await this.usersService.findByParams({
      user_name: registerUserDto.user_name
    });
    if (userNameExist) {
      throw new BadRequestException('Username already exist!')
    }

    const userEmailExist = await this.usersService.findByParams({ 
      email: registerUserDto.email
    });
    if (userEmailExist) {
      throw new BadRequestException('Email already exist!')
    }

    let user = await this.usersService.create(registerUserDto);
    return this.responseProvider.success(
      'User registered successfully',
      user,
    )
  }

  @Post('login')
  @ApiCreatedResponse()
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ description: "User login" })
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserLogin> {
    const user = await this.usersService.verifyLogin(loginUserDto);
    if (!user) {
      throw new BadRequestException('Invalid username or password!')
    }
    
    const jwtToken = await this.usersService.getJwtToken(user as UserDocument);

    return this.responseProvider.success(
      'User login successfully',
      { token: jwtToken },
    )
  }

  @Get('profile')
  @ApiOkResponse()
  @ApiHeader({ name: "auth_token"})
  @ApiResponse({ description: "User Profile" })
  async profile(@Body('user_id') user_id: string): Promise<UserResponse> {
    const user = await this.usersService.findById(user_id);
    if (!user) {
      throw new BadRequestException('No user found!')
    }
    
    return this.responseProvider.success(
      'User Profile!',
      user,
    )
  }
}
