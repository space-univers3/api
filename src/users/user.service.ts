import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { BaseService } from "@/common/base.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./models/user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService extends BaseService<User> {
	constructor(private readonly userRepository: UserRepository) {
		super(userRepository);
	}

	protected getEntityName(): string {
		return "User";
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.userRepository.findByEmail(email);
	}

	async findByRoleId(roleId: string): Promise<User[]> {
		return this.userRepository.findByRoleId(roleId);
	}

	async createUser(createUserInput: CreateUserInput): Promise<User> {
		// Check if email already exists
		const existingUser = await this.userRepository.findByEmail(
			createUserInput.email,
		);
		if (existingUser) {
			throw new ConflictException("Email already exists");
		}

		// Hash password
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(
			createUserInput.password,
			saltRounds,
		);

		// Create user
		const userData = {
			...createUserInput,
			password: hashedPassword,
		};

		return this.userRepository.create(userData);
	}

	// Override the base create method to use our custom logic
	async create(data: CreateUserInput): Promise<User> {
		return this.createUser(data);
	}

	async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
		const { id, ...updateData } = updateUserInput;

		// Check if user exists
		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		// Check if email is being updated and already exists
		if (updateData.email && updateData.email !== existingUser.email) {
			const emailExists = await this.userRepository.emailExists(
				updateData.email,
			);
			if (emailExists) {
				throw new ConflictException("Email already exists");
			}
		}

		// Hash password if being updated
		if (updateData.password) {
			const saltRounds = 12;
			updateData.password = await bcrypt.hash(updateData.password, saltRounds);
		}

		const updatedUser = await this.userRepository.update(id, updateData);
		if (!updatedUser) {
			throw new NotFoundException(`User with ID ${id} not found after update`);
		}

		return updatedUser;
	}

	async validatePassword(
		email: string,
		password: string,
	): Promise<User | null> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			return null;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return null;
		}

		return user;
	}

	async changePassword(id: string, newPassword: string): Promise<User> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

		const updatedUser = await this.userRepository.update(id, {
			password: hashedPassword,
		});

		if (!updatedUser) {
			throw new NotFoundException(
				`User with ID ${id} not found after password update`,
			);
		}

		return updatedUser;
	}

	async emailExists(email: string): Promise<boolean> {
		return this.userRepository.emailExists(email);
	}
}
