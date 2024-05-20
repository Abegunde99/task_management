import { Injectable, NotFoundException } from '@nestjs/common';
import {  TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks_filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Task} from './task.entity'
import { User } from 'src/auth/auth.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ){}

    // async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    //     const { status, search } = filterDto;
    //     const query = this.taskRepository.createQueryBuilder('task');

    //     const tasks = await query.getMany({ where: { status } , search});
    //     return tasks;
    // }

    async getAllTasks(user: User): Promise<Task[]> { 
        return await this.taskRepository.find({ where: { user } });
    }

    async getTasksWithFilters(filterDto: GetTaskFilterDto, user:User): Promise<Task[]> { 
        const {status, search} = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id });
        if (status) {
            query.andWhere('task.status = :status', {status});
        }
        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`});
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async getTaskById(id: number): Promise<Task> { 
        const task = await this.taskRepository.findOne({
            where: {
                id,
            }
        });
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> { 
        const {title, description} = createTaskDto;
        const task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });
        await this.taskRepository.save(task);
        task.user = user;
        await this.taskRepository.save(task);
        delete task.user;
        return task;
    }

    async deleteTask(id: number): Promise<void> { 
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }

    
}
