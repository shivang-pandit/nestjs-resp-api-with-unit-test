import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, description: 'user_name'})
    user_name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, description: 'password'})
    password: string
}
