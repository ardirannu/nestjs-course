import { Req } from "@nestjs/common";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password is too weak'})
    // Passwords will contain at least 1 upper case letter
    // Passwords will contain at least 1 lower case letter
    // Passwords will contain at least 1 number or special character
    // There is no length validation (min, max) in this regex!

    password: string;
}