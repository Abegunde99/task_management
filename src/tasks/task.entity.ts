/* eslint-disable prettier/prettier */
import { BaseEntity, Column, ManyToOne, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { User } from "src/auth/auth.entity";

@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus

    @ManyToOne(type => User, user => user.tasks, { eager: false })
    user: User
}