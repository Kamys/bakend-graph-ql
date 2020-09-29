import {Field, ID, ObjectType } from "type-graphql";
import {Author} from "./author.entity";
import {BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity()
export class Book extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    bookId: string;
    @Field()
    @Column()
    name: string;
    @Field()
    @Column()
    pageCount: number;
    @Field({ nullable: true })
    @Column({ nullable: true })
    authorId?: string;
    @Field(() => [Author], { nullable: true })
    @ManyToMany(() => Author, author => author.authorId)
    @JoinColumn()
    authors: Author[];
}