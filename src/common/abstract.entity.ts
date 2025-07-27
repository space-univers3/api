import { Field, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

@ObjectType({
	isAbstract: true,
})
export abstract class AbstractEntity {
	@Field(() => Date)
	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@Field(() => Date)
	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;

	@Field(() => Date, { nullable: true })
	@DeleteDateColumn({ type: "timestamptz", nullable: true })
	deletedAt?: Date | null;
}
