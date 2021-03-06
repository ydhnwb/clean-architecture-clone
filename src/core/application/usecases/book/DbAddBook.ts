import { AddBookRepository } from '@application/protocol/repositories/book/AddBookRepository';
import { AddBook } from '@entities/usecases/book/AddBook';

export class DbAddBook implements AddBook {
  constructor(private readonly addBookreporitory: AddBookRepository) {}

  async add(params: AddBook.Params): Promise<AddBook.Return> {
    const status = await this.addBookreporitory.add(params);
    return status;
  }
}
