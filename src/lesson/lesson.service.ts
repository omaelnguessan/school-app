import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
  ) {}

  async getAllLesson(): Promise<Lesson[]> {
    return await this.lessonRepository.find();
  }

  async getLesson(id: string): Promise<Lesson> {
    return await this.lessonRepository.findOne({ where: { id } });
  }

  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const id: string = uuid();
    const { name, startDate, endDate, students } = createLessonInput;
    const lesson: Lesson = this.lessonRepository.create({
      id,
      name,
      startDate,
      endDate,
      students,
    });

    await this.lessonRepository.save(lesson);

    return lesson;
  }

  async assignStudentsToLesson(
    assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ): Promise<Lesson> {
    const { lessonId, studentIds } = assignStudentsToLessonInput;

    const lesson: Lesson = await this.lessonRepository.findOne({
      where: {
        id: lessonId,
      },
    });

    lesson.students = [...lesson.students, ...studentIds];

    await this.lessonRepository.save(lesson);

    return lesson;
  }
}
