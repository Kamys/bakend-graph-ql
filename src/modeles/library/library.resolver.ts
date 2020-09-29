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

    @Query(() => [Book])
    async books() {
        return Book.find({ relations: ["authors"] });
    }
}