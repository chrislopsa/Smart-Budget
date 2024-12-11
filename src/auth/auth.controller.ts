import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<BaseResponseDto> {
    const newUser = await this.authService.register(registerUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User successfully registered',
      data: newUser.username
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<BaseResponseDto> {
    const identifiedUser = await this.authService.login(loginUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: identifiedUser
    }
  }
}