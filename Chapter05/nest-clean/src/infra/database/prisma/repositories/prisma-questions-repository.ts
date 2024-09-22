import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    )
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      }
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems()
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
    ])
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug: slug,
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug: slug,
      },
      include: {
        attachments: true,
        author: true,
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionDetailsMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const perPage = 20
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }
}