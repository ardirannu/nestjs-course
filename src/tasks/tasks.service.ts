import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) {}

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user);
    }

    async getTaskById(taskId: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOneBy({ id: taskId, user: user });

        if(!found){
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }
        
        return found;        
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user);    
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = this.tasksRepository.delete({ id, user });

        if((await result).affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;

        await this.tasksRepository.save(task);
        return task;
    }
}
