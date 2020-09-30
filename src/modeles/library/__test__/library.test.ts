import {Connection} from "typeorm";
import {createTestConnection} from "../../../testUtils/createTestConnection";

import {Author} from "../../../entity/author.entity";
import {Book} from "../../../entity/book.entity";
import {attachAuthor, createAuthor, createBook } from "../../../testUtils/library";
import {requestGraphql} from "../../../testUtils/requestGraphql";

let conn: Connection;
beforeAll(async () => {
    conn = await createTestConnection({dropSchema: true});
});
afterAll(async () => {
    await conn.close();
});

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
        const authorId = responseAuthor.data.createAuthor.authorId;

        const responseAttach = await attachAuthor({
            bookId,
            authorId,
        })

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

    it("get all author without books", async () => {
        await Author.delete({})
        const responseAuthor = await createAuthor('Author with book')
        const responseBook = await createBook('Book', 100)



        await attachAuthor({
            authorId: responseAuthor.data.createAuthor.authorId,
            bookId: responseBook.data.createBook.bookId,
        })

        const source = `
        {
          authors(withoutBooks: true) {
            authorId
          }
        }
        `

        const responseAuthorWithoutBook = await createAuthor('Author without book')
        const response = await requestGraphql({
            source,
        });

        expect(response.data).toMatchObject({
            authors: [
                {
                    authorId: responseAuthorWithoutBook.data.createAuthor.authorId,
                }
            ]
        })
    });

    it("get all books without author", async () => {
        await Book.delete({})
        const responseAuthor = await createAuthor('Author with book')
        const responseBook = await createBook('Book with author', 100)



        await attachAuthor({
            authorId: responseAuthor.data.createAuthor.authorId,
            bookId: responseBook.data.createBook.bookId,
        })

        const source = `
        {
          books(withoutAuthors: true) {
            bookId
          }
        }
        `

        const responseBookWithoutAuthor = await createBook('Book without author', 100)
        const response = await requestGraphql({
            source,
        });

        expect(response.data).toMatchObject({
            books: [
                {
                    bookId: responseBookWithoutAuthor.data.createBook.bookId,
                }
            ]
        })
    });
});