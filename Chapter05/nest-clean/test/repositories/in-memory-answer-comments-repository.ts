import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === answerComment.id)

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const answerComment = this.items.find(item => item.id.toString() === id)

    return answerComment ?? null
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const commentsWithAuthor = this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map(comm => {
        const author = this.studentsRepository.items.find(student => 
          student.id.equals(comm.authorId)
        )

        if (!author) {
          throw new Error(`Author with ID "${comm.authorId.toString()}" does not exist.`)
        }

        return CommentWithAuthor.create({
          content: comm.content,
          commentId: comm.id,
          createdAt: comm.createdAt,
          updatedAt: comm.updatedAt,
          authorId: comm.authorId,
          author: author.name,
        })
      })
    
    return commentsWithAuthor
  }
}