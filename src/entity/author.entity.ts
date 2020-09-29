import {Field, ID, ObjectType } from "type-graphql";
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity()
export class Author extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    authorId: string;

    @Field()
    @Column()
    name: string;
}