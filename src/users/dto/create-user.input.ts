import { Field, InputType } from "@nestjs/graphql";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MinLength,
} from "class-validator";

@InputType()
export class CreateUserInput {
	@Field(() => String, { description: "E-mail of the user" })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Field(() => String, { description: "Password of the user" })
	@IsString()
	@MinLength(6)
	@IsNotEmpty()
	password: string;

	@Field(() => String, { description: "Full name of the user" })
	@IsString()
	@IsNotEmpty()
	fullName: string;

	@Field(() => String, {
		description: "Avatar URL of the user",
		nullable: true,
	})
	@IsString()
	@IsOptional()
	avatarUrl?: string;

	@Field(() => String, { description: "Role ID of the user", nullable: true })
	@IsUUID()
	@IsOptional()
	roleId: string;
}
