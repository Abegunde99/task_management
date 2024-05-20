import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }
    
    //@desc     sign up
    //@route    POST /auth/signup
    //@access   Public
    @Post('signup')
    signUp(@Body(ValidationPipe) userCredentialsDto:UserCredentialsDto): any { 
        return this.authService.signUp(userCredentialsDto);
    }


    //@desc     sign in
    //@route    POST /auth/signin
    //@access   Public
    @Post('signin')
    signIn(@Body(ValidationPipe) userCredentialsDto:UserCredentialsDto): Promise<{accessToken: string}>{ 
        return this.authService.signIn(userCredentialsDto);
    }


}
