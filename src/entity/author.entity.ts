import {Field, ObjectType } from "type-graphql";
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity()
export class Author extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    authorId: string;

    @Field()
    @Column()
    name: string;
}