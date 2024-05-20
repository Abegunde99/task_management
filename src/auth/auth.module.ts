import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt-strategy';
import { Task } from 'src/tasks/task.entity';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    JwtStrategy
  ],
  imports: [
    // import the TypeOrmModule
    TypeOrmModule.forFeature([
      User,
      Task
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      }
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
