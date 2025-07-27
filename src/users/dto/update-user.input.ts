import { Field, InputType, PartialType } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";
import { CreateUserInput } from "./create-user.input";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
	@Field(() => String, { description: "User ID" })
	@IsUUID()
	id: string;

	@Field(() => String, { description: "E-mail of the user", nullable: true })
	@IsOptional()
	email?: string;

	@Field(() => String, { description: "Password of the user", nullable: true })
	@IsOptional()
	password?: string;

	@Field(() => String, { description: "Full name of the user", nullable: true })
	@IsOptional()
	fullName?: string;

	@Field(() => String, {
		description: "Avatar URL of the user",
		nullable: true,
	})
	@IsOptional()
	avatarUrl?: string;

	@Field(() => String, { description: "Role ID of the user", nullable: true })
	@IsOptional()
	roleId?: string;
}
