import { UserInputError } from "apollo-server-express";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Author } from "../../entity/author.entity";
import {Book} from "../../entity/book.entity";

@Resolver()
export class LibraryResolver {
    @Mutation(() => Author)
    async createAuthor(@Arg("name") name: string) {
        return Author.create({ name }).save();
    }

    @Query(() => [Author])
    async authors() {
        return Author.find();
    }

    @Mutation(() => Book)
    async createBook(
        @Arg("name") name: string,
        @Arg("pageCount") pageCount: number,
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

    @Query(() => [Book])
    async books() {
        return Book.find({ relations: ["authors"] });
    }
}