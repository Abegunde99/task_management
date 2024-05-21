/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Post, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import {TasksService} from './tasks.service'
import { TaskStatus} from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks_filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import {Task} from './task.entity'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/auth.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    //@desc     get all tasks
    //@route    GET /tasks
    //@access   Public
    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> { 
        if(Object.keys(filterDto).length){
            return this.tasksService.getTasksWithFilters(filterDto, user);
        } else {
            return this.tasksService.getAllTasks(user);
        }
    }
    // @Get()
    // getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> { 
    //     return this.tasksService.getTasks(filterDto);
    // }


    //@desc     create a task
    //@route    POST /tasks
    //@access   Public
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }


    //@desc     get task by id
    //@route    GET /tasks/:id
    //@access   Public
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }


    //@desc     delete task by id
    //@route    DELETE /tasks/:id
    //@access   Public
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): void{
        this.tasksService.deleteTask(id);
    }


    //@desc     update task status by id
    //@route    PATCH /tasks/:id/status
    //@access   Public
    @Patch('/:id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task>{
        return this.tasksService.updateTaskStatus(id, status)
    }
}
