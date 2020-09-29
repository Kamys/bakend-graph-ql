import {Field, ObjectType } from "type-graphql";
import {Author} from "./author.entity";
import {
    BaseEntity,
    Column,
    Entity,
    JoinTable, ManyToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@ObjectType()
@Entity()
export class Book extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    bookId: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    pageCount: number;

    @Field(() => [Author], { nullable: true })
    @ManyToMany(() => Author)
    @JoinTable()
    authors: Author[];
}