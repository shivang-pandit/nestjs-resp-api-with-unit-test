import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDocument } from './schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserParams, UserResponse } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  async create(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    return await (new this.userModel(registerUserDto).save());
  }

  async verifyLogin(loginUserDto: LoginUserDto): Promise<boolean | UserDocument> {
    const user = await this.findByParams({ user_name: loginUserDto.user_name })
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    //If user has a maximum of 3 attempts within 5 minutes then locked that user.
    let datetime = new Date();
    datetime.setMinutes(datetime.getMinutes()-5);
    if(user.login_attempts >= 3 && new Date(user.login_attempts_date.toString()) > datetime) {
      throw new NotFoundException(`Your account has been locked for 5 minutes due to multiple attempts!`);
    }

    const passwordCheck = await this.validatePassword(user.password, loginUserDto.password)
    if (!passwordCheck) {
      //increase login attempts on each failures.
      user.login_attempts = (user.login_attempts>=3?0:user.login_attempts) + 1;
      user.login_attempts_date = new Date().toISOString();
      user.save();
      throw new NotFoundException(`Invalid password!`);
    }

    //reset login attempts on each success.
    user.login_attempts = 0;
    user.login_attempts_date = new Date().toISOString();
    user.save();
    return user;
  }

  async findByParams(params: UserParams): Promise<UserDocument> {
    return await this.userModel.findOne(params)
  }

  async validatePassword(userPassword: string, password: string): Promise<boolean> {
    let status = false;
    let passwordCheck = await bcrypt.compare(password, userPassword);
    if (passwordCheck) {
      status = true;
    };
    return status;
  }

  async getJwtToken(user: UserDocument): Promise<string> {
    let token = await this.jwtService.signAsync({
      user_id: user.id,
      user_name: user.user_name,
      email: user.email,
    }, { secret: process.env.JWT_ENCRYPTION });
    return token;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async updateLoginAttempts(userName: string): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate({
      'user_name': userName
    },
      {
        $inc: {
          login_attempts: 1
        },
        login_attempts_date: new Date()
      },
      {
        new: true
      }
    );
    return user;
  }
}
