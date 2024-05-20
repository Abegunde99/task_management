import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "./auth.entity";
import { UserCredentialsDto } from "./dto/user-credentials.dto";
import { BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common";

export class UserRepository extends Repository<User>{
    async signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
        const { username, password } = userCredentialsDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();
        }catch(error){
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(userCredentialsDto: UserCredentialsDto): Promise<string> { 
        const { username, password } = userCredentialsDto;
        const user = await User.findOne({where: {username} });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            throw new BadRequestException('Invalid credentials');
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}