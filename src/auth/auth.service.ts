import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        try {
            const { email, password, username, phone } = registerUserDto;

       
            const userFound = await this.userService.findOneByEmail(email);
    
            if (userFound) {
                throw new ConflictException('El usuario ya existe');
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
            throw new InternalServerErrorException('Error interno del servidor');
        }
       
    }

    async login(loginUserDto: LoginUserDto) {
        
        const { email, password } = loginUserDto;
        const userFound = await this.userService.findOneByEmail(email);
        console.log('userFound:',userFound);
            
        if (!userFound) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        console.log('isPasswordValid:',isPasswordValid);
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
       
        const payload = {userId: userFound.id};
        const token = await this.jwtService.signAsync(payload)

        return {
            access_token: token,
            user: {
                id: userFound.id,
                email: userFound.email,
                name: userFound.username
            }
        };
    }
}