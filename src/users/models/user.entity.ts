import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { AbstractEntity } from "@/common/abstract.entity";
import { Role } from "@/roles/models/role.entity";

@ObjectType({
	description: "User model",
})
@Entity("users")
export class User extends AbstractEntity {
	@Field(() => ID, {
		description: "Unique identifier for the entity",
	})
	@PrimaryGeneratedColumn("uuid", {
		name: "user_id",
	})
	readonly id: string;

	@Field(() => String, {
		description: "E-mail of the user",
	})
	@Column({
		name: "email",
		type: "varchar",
		unique: true,
	})
	email: string;

	@Field(() => String, {
		description: "Password of the user",
	})
	@Column({
		name: "password",
		type: "varchar",
	})
	password: string;

	@Field(() => String, {
		description: "Full name of the user",
	})
	@Column({
		name: "full_name",
		type: "varchar",
	})
	fullName: string;

	@Field(() => String, {
		description: "Avatar URL of the user",
		nullable: true,
	})
	@Column({
		name: "avatar_url",
		type: "varchar",
		nullable: true,
	})
	avatarUrl?: string | null;

	@Field(() => String, {
		description: "Role of the user",
	})

	@Column({
		nullable: true,
	}) // FK column; handy for queries
	roleId?: string | null;

	@ManyToOne(
		() => Role,
		(role) => role.users,
		{ eager: true, nullable: true },
	)
	@JoinColumn({ name: "roleId" })
	@Field(() => Role, {
		description: "Role of the user",
		nullable: true,
	})
	role?: Role | null;
}
