import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

// Membuat objek mock untuk TasksRepository
const mockTasksRepository = () => ({
    getTasks: jest.fn().mockResolvedValue([
        { id: '1', title: 'Test Task', description: 'Task description', status: 'OPEN' },
    ]), 
    findOneBy: jest.fn(),
});

// Data pengguna palsu untuk pengujian
const mockUser = {
    username: 'Ardi',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
};

describe('Tasks Service', () => {
    let tasksService: TasksService;
    let tasksRepository: ReturnType<typeof mockTasksRepository>;

    beforeEach(async () => {
        // Menginisialisasi modul NestJS untuk unit testing
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository,
                    useFactory: mockTasksRepository,
                },
            ],
        }).compile();

        // Mendapatkan instance TasksService dan TasksRepository
        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
    });

    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and returns the result', async () => {
            expect(tasksRepository.getTasks).not.toHaveBeenCalled(); // Pastikan belum dipanggil

            // Memanggil tasksService.getTasks, yang seharusnya memanggil tasksRepository.getTasks
            const result = await tasksService.getTasks(null, mockUser); // Tambahkan await karena fungsi async

            // Pastikan getTasks dipanggil pada repository
            expect(tasksRepository.getTasks).toHaveBeenCalled();

            // Memeriksa apakah hasilnya sesuai dengan data mock yang dikembalikan oleh getTasks
            expect(result).toEqual([
                { id: '1', title: 'Test Task', description: 'Task description', status: 'OPEN' },
            ]);
        });
    });

    describe('getTaskById', () => {
        it('calls TasksRepository.findOne and returns the result', async () => {
            const mockTask = {
                title: 'Test title',
                description: 'Test desc',
                id: 'someId',
                status: TaskStatus.OPEN,
            };

            tasksRepository.findOneBy.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('someId', mockUser);
            expect(result).toEqual(mockTask);
        });

        it('calls TasksRepository.findOne and handles an error', async () => {
            tasksRepository.findOneBy.mockResolvedValue(null);
            expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
