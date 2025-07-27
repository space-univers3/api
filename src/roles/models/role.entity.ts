import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "@/common/abstract.entity";
import { User } from "@/users/models/user.entity";

@ObjectType({
	description: "Role model",
})
@Entity("roles")
export class Role extends AbstractEntity {
	@Field(() => ID, {
		description: "Unique identifier for the role",
	})
	@PrimaryGeneratedColumn("uuid", {
		name: "role_id",
	})
	readonly id: string;

	@Field(() => String, {
		description: "Name of the role",
	})
	@Column({
		name: "name",
		type: "varchar",
		unique: true,
	})
	name: string;

	@Field(() => String, {
		description: "Description of the role",
		nullable: true,
	})
	@Column({
		name: "description",
		type: "varchar",
		nullable: true,
	})
	description?: string | null;

	@Field(() => [User], {
		description: "Users with this role",
	})
	@OneToMany(
		() => User,
		(user) => user.role,
	)
	users: User[];
}
