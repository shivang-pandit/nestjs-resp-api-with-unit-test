import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "../../decorators/match.decorator";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @ApiProperty({ type: String, description: 'first_name'})
    first_name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @ApiProperty({ type: String, description: 'last_name'})
    last_name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(15)
    @Matches(/^[a-z0-9_\.]+$/,{ message: 'Username can only have Lowercase Letters (a-z), Numbers (0-9), Dots (.), Underscores (_)' })
    @ApiProperty({ type: String, description: 'user_name'})
    user_name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String, description: 'email'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, { message: 'password must contain at least 8 characters, consisting of at least 1 uppercase letter, 1 lowercase letter and 1 number' })
    @ApiProperty({ type: String, description: 'password'})
    password: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Match('password')
    @ApiProperty({ type: String, description: 'confirm_password'})
    confirm_password: string
}
