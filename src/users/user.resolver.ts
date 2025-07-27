import { Logger, ParseUUIDPipe } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BaseResolver } from "@/common/base.resolver";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./models/user.entity";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver extends BaseResolver<
	User,
	CreateUserInput,
	UpdateUserInput
> {
	private readonly logger = new Logger(UserResolver.name);
	constructor(private readonly userService: UserService) {
		super(userService, User);
	}

	// Override base methods with proper GraphQL decorators and User-specific names
	@Query(() => [User], {
		name: "users",
		description: "Get all users",
	})
	async findAll(): Promise<User[]> {
		return this.userService.findAll();
	}

	@Query(() => User, {
		name: "user",
		description: "Get user by ID",
	})
	async findById(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
	): Promise<User> {
		return this.userService.findById(id);
	}

	@Query(() => Number, {
		name: "userCount",
		description: "Get total number of users",
	})
	async count(): Promise<number> {
		return this.userService.count();
	}

	@Query(() => Boolean, {
		name: "userExists",
		description: "Check if user exists by ID",
	})
	async exists(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
	): Promise<boolean> {
		return this.userService.exists(id);
	}

	@Mutation(() => User, {
		name: "createUser",
		description: "Create a new user",
	})
	async create(
		@Args("createUserInput") createUserInput: CreateUserInput,
	): Promise<User> {
		this.logger.log(
			`Create user with input: ${JSON.stringify(createUserInput)}`,
		);
		return this.userService.createUser(createUserInput);
	}

	@Mutation(() => User, {
		name: "updateUser",
		description: "Update an existing user",
	})
	async update(
		@Args("updateUserInput") updateUserInput: UpdateUserInput,
	): Promise<User> {
		return this.userService.updateUser(updateUserInput);
	}

	@Mutation(() => Boolean, {
		name: "deleteUser",
		description: "Delete a user permanently",
	})
	async delete(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
	): Promise<boolean> {
		return this.userService.delete(id);
	}

	@Mutation(() => Boolean, {
		name: "softDeleteUser",
		description: "Soft delete a user",
	})
	async softDelete(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
	): Promise<boolean> {
		return this.userService.softDelete(id);
	}

	@Mutation(() => Boolean, {
		name: "restoreUser",
		description: "Restore a soft deleted user",
	})
	async restore(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
	): Promise<boolean> {
		return this.userService.restore(id);
	}

	// User-specific methods that don't exist in BaseResolver
	@Query(() => User, {
		name: "userByEmail",
		description: "Get user by email",
		nullable: true,
	})
	async findByEmail(
		@Args("email", { type: () => String }) email: string,
	): Promise<User | null> {
		return this.userService.findByEmail(email);
	}

	@Query(() => [User], {
		name: "usersByRole",
		description: "Get users by role ID",
	})
	async findByRoleId(
		@Args("roleId", { type: () => ID }, ParseUUIDPipe) roleId: string,
	): Promise<User[]> {
		return this.userService.findByRoleId(roleId);
	}

	@Query(() => Boolean, {
		name: "emailExists",
		description: "Check if email exists",
	})
	async emailExists(
		@Args("email", { type: () => String }) email: string,
	): Promise<boolean> {
		return this.userService.emailExists(email);
	}

	@Mutation(() => User, {
		name: "changeUserPassword",
		description: "Change user password",
	})
	async changePassword(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
		@Args("newPassword", { type: () => String }) newPassword: string,
	): Promise<User> {
		return this.userService.changePassword(id, newPassword);
	}
}