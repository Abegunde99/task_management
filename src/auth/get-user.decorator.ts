/* eslint-disable prettier/prettier */
import { createParamDecorator } from "@nestjs/common";
import { User } from "./auth.entity";

export const GetUser = createParamDecorator((data, req): User => { 
    return req.args[0].user;
});