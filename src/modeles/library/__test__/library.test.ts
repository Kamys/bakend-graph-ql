import {Connection} from "typeorm";
import {createTestConnection} from "../../../testUtils/createTestConnection";

import {Author} from "../../../entity/author.entity";
import {Book} from "../../../entity/book.entity";
import { createAuthor, createBook } from "../../../testUtils/library";
import {requestGraphql} from "../../../testUtils/requestGraphql";

let conn: Connection;
beforeAll(async () => {
    conn = await createTestConnection({dropSchema: true});
});
afterAll(async () => {
    await conn.close();
});

type AttachAuthorResponse = {
    data: {
        attachAuthor: {
            bookId: string
        }
    }
}

describe("Library", () => {
    it("author is created", async () => {

        const authorName = 'Alexander Sergeyevich Pushkin'
        const response = await createAuthor(authorName)

        expect(response.data).toMatchObject({
            createAuthor: {
                authorId: expect.any(String)
            }
        })

        const author = await Author.findOne(response.data?.createAuthor.authorId);
        expect(author).toBeDefined();
        expect(author?.name).toBe(authorName);
    });

    it("book is created", async () => {

        const bookName = 'The Captains Daughter'
        const pageCount = 387

        const response = await createBook(bookName, pageCount);

        expect(response.data).toMatchObject({
            createBook: {
                bookId: expect.any(String)
            }
        })

        const book = await Book.findOne(response.data?.createBook.bookId);
        expect(book).toBeDefined();
        expect(book?.name).toBe(bookName);
        expect(book?.pageCount).toBe(pageCount);
    });

    it("author attached to book", async () => {

        const authorName = 'Alexander Sergeyevich Pushkin'

        const bookName = 'The Captains Daughter'
        const pageCount = 387

        const responseAuthor = await createAuthor(authorName)
        const responseBook = await createBook(bookName, pageCount)
        const bookId = responseBook.data.createBook.bookId;

        const source = `
            mutation Attach($bookId: String!, $authorId: String!) {
              attachAuthor(bookId: $bookId, authorId: $authorId) {
                bookId
              }
            }
        `

        const responseAttach = await requestGraphql({
            source,
            variableValues: {
                bookId,
                authorId: responseAuthor.data.createAuthor.authorId,
            }
        }) as AttachAuthorResponse;

        expect(responseAttach.data).toMatchObject({
            attachAuthor: {
                bookId,
            }
        })

        const book = await Book.findOne(bookId, {relations: ["authors"]});
        expect(book).toBeDefined();
        expect(book?.name).toBe(bookName);
        expect(book?.pageCount).toBe(pageCount);

        const bookAuthor = book?.authors[0]
        expect(bookAuthor).toBeDefined();
        expect(bookAuthor?.name).toBe(authorName);
    });
});