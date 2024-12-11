import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dto/login-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        try {
            const { email, password, username, phone } = registerUserDto;

            const existingUser = await this.userService.findOneByEmail(email);
    
            if (existingUser) {
                throw new ConflictException('Email already registered');
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
           
            const user = await this.userService.create({
                username,
                email,
                password: hashedPassword,
                phone,
            });
    
            delete user.password;
            return user;

        } catch (error) {
            if(error instanceof ConflictException) throw new ConflictException(error.message);

            throw new InternalServerErrorException('Internal server error');
        }
       
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
        try {
            const { email, password } = loginUserDto;
            const userFound = await this.userService.findOneByEmail(email);
                
            if (!userFound)  throw new UnauthorizedException('Invalid credentials');
    
            const isPasswordValid = await bcrypt.compare(password, userFound.password);
            
            if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
            
            const payload = {userId: userFound.id};
            const token = await this.jwtService.signAsync(payload)
    
            return {
                access_token: token,
                user: {
                    id: userFound.id,
                }
            };

        } catch (error) {
            if(error instanceof UnauthorizedException) throw new UnauthorizedException(error.message);

            throw new InternalServerErrorException('Internal server error');
        }
    }
}