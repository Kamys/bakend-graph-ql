import { UserInputError } from "apollo-server-express";
import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import { Author } from "../../entity/author.entity";
import {Book} from "../../entity/book.entity";


const queryBookWithoutAuthor = `
    SELECT *
    FROM book
             LEFT JOIN book_authors_author ON book_authors_author."bookBookId" = book."bookId"
    WHERE "authorAuthorId" is NULL
`

const queryAuthorWithoutBook = `
    SELECT *
    FROM author
             LEFT JOIN book_authors_author ON book_authors_author."bookBookId" = author."authorId"
    WHERE "authorAuthorId" is NULL
`

@Resolver()
export class LibraryResolver {
    @Mutation(() => Author)
    async createAuthor(@Arg("name") name: string) {
        return Author.create({ name }).save();
    }

    @Query(() => [Author])
    async authors(@Arg("withoutBooks", { nullable: true }) withoutBooks?: boolean) {

        if (withoutBooks) {
            return Author.query(queryAuthorWithoutBook)
        }

        return Author.find({ relations: ["books"] });
    }

    @Query(() => [Book])
    async books(@Arg("withoutAuthors", { nullable: true }) withoutAuthors?: boolean) {
        if (withoutAuthors) {
           return Book.query(queryBookWithoutAuthor)
        }

        return Book.find({ relations: ["authors"] });
    }

    @Mutation(() => Book)
    async createBook(
        @Arg("name") name: string,
        @Arg("pageCount", () => Int) pageCount: number,
    ) {
        return Book.create({ name, pageCount }).save();
    }

    @Mutation(() => Book)
    async attachAuthor(
        @Arg("authorId") authorId: string,
        @Arg("bookId") bookId: string,
    ) {
        const book = await Book.findOne(bookId, { relations: ["authors"] })

        if (!book) {
            throw new UserInputError(`Book with id '${bookId}' not found`, { bookId })
        }

        const author = await Author.findOne(authorId)
        if (!author) {
            throw new UserInputError(`Author with id '${authorId}' not found`, { authorId })
        }

        const attachAlreadyExist = book.authors?.some(author => author.authorId.toString() === authorId.toString())

        if (attachAlreadyExist) {
            throw new UserInputError(`Attach already exist`)
        }

        book.authors = [
            ...book.authors || [],
            author,
        ]

        return Book.save(book);
    }
}