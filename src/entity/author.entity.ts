import {Field, ObjectType } from "type-graphql";
import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Book } from "./book.entity";

@ObjectType()
@Entity()
export class Author extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    authorId: string;

    @Field()
    @Column()
    name: string;

    @Field(() => [Book], { nullable: true })
    @ManyToMany(() => Book, book => book.authors)
    books: Book[];
}