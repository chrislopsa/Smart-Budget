import {IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)   //, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
    
    @IsNotEmpty()
    @IsString()
    phone: string;
}