import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { BaseRepository } from "@/common/base.repository";
import { User } from "./models/user.entity";

@Injectable()
export class UserRepository extends BaseRepository<User> {
	protected readonly repository: Repository<User>;

	constructor(
		@InjectRepository(User)
		repository: Repository<User>,
	) {
		super(repository);
		this.repository = repository;
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.repository.findOne({
			where: { email },
			relations: ["role"],
		});
	}

	async findByRoleId(roleId: string): Promise<User[]> {
		return this.repository.find({
			where: { roleId },
			relations: ["role"],
		});
	}

	async emailExists(email: string): Promise<boolean> {
		const count = await this.repository.count({ where: { email } });
		return count > 0;
	}

	// Override base methods to include relations
	async findAll(): Promise<User[]> {
		return this.repository.find({
			relations: ["role"],
		});
	}

	async findById(id: string): Promise<User | null> {
		return this.repository.findOne({
			where: { id },
			relations: ["role"],
		});
	}
}
