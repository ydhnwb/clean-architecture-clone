import { Validation } from '@adapter/protocol/Validation';
import { DeleteBookDto } from '@adapter/validation/dto/book/DeleteBookDto';
import { RequestParamsValidation } from '@adapter/validation/validator/RequestParamsValidation';

export const makeDeleteBookValidation = (): Validation => {
  return new RequestParamsValidation(DeleteBookDto);
};
