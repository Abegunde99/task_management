import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }
    
    async signUp(userCredentialsDto: UserCredentialsDto): Promise<any> {
        return this.userRepository.signUp(userCredentialsDto);  
    }

    async signIn(userCredentialsDto: UserCredentialsDto): Promise<{accessToken: string}> { 
        const username = await this.userRepository.validateUserPassword(userCredentialsDto);

        if (!username) throw new UnauthorizedException('Invalid credentials');

        const payload: JwtPayload = { username }
        const accessToken: string = await this.jwtService.sign(payload)

        return {accessToken};
    }
}
