import { requestGraphql } from './requestGraphql';

type AuthorResponse = {
  data: {
    createAuthor: {
      authorId: string;
    };
  };
};

export const createAuthor = async (name: string): Promise<AuthorResponse> => {
  const source = `
        mutation CreateAuthor($name: String!) {
            createAuthor(name: $name) {  authorId }
        }
        `;

  return (await requestGraphql({
    source,
    variableValues: {
      name,
    },
  })) as AuthorResponse;
};

type BookResponse = {
  data: {
    createBook: {
      bookId: string;
    };
  };
};

export const createBook = async (
  name: string,
  pageCount: number,
): Promise<BookResponse> => {
  const source = `
        mutation CreateBook($name: String!, $pageCount: Int!) {
          createBook(name: $name, pageCount: $pageCount) {
            bookId
          }
        }
        `;

  return (await requestGraphql({
    source,
    variableValues: {
      name,
      pageCount,
    },
  })) as BookResponse;
};

type AttachAuthorResponse = {
  data: {
    attachAuthor: {
      bookId: string;
    };
  };
};

type AttachAuthorParams = {
  bookId: string;
  authorId: string;
};

export const attachAuthor = async ({
  bookId,
  authorId,
}: AttachAuthorParams): Promise<AttachAuthorResponse> => {
  const source = `
            mutation Attach($bookId: String!, $authorId: String!) {
              attachAuthor(bookId: $bookId, authorId: $authorId) {
                bookId
              }
            }
        `;

  return (await requestGraphql({
    source,
    variableValues: {
      bookId,
      authorId,
    },
  })) as AttachAuthorResponse;
};
