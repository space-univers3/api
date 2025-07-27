import { Injectable } from "@nestjs/common";
import type {
	DeepPartial,
	DeleteResult,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	Repository,
	UpdateResult,
} from "typeorm";
import type { AbstractEntity } from "./abstract.entity";

export interface BaseEntity extends AbstractEntity {
	id: string;
}

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> {
	constructor(protected readonly repository: Repository<T>) {}

	async findAll(options?: FindManyOptions<T>): Promise<T[]> {
		return this.repository.find(options);
	}

	async findById(id: string, options?: FindOneOptions<T>): Promise<T | null> {
		return this.repository.findOne({
			where: { id } as FindOptionsWhere<T>,
			...options,
		});
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const entity = this.repository.create(data);
		return this.repository.save(entity);
	}

	async update(id: string, data: DeepPartial<T>): Promise<T | null> {
		// TypeORM's update method has complex typing that doesn't play well with generics
		// This is a common pattern in TypeORM repositories
		await this.repository.update(
			id,
			data as Parameters<Repository<T>["update"]>[1],
		);
		return this.findById(id);
	}

	async delete(id: string): Promise<boolean> {
		const result: DeleteResult = await this.repository.delete(id);
		return result.affected !== null && result.affected > 0;
	}

	async softDelete(id: string): Promise<boolean> {
		const result: UpdateResult = await this.repository.softDelete(id);
		return result.affected !== null && result.affected > 0;
	}

	async restore(id: string): Promise<boolean> {
		const result: UpdateResult = await this.repository.restore(id);
		return result.affected !== null && result.affected > 0;
	}

	async count(options?: FindManyOptions<T>): Promise<number> {
		return this.repository.count(options);
	}

	async exists(id: string): Promise<boolean> {
		const count = await this.repository.count({
			where: { id } as FindOptionsWhere<T>,
		});
		return count > 0;
	}

	async findOne(options: FindOneOptions<T>): Promise<T | null> {
		return this.repository.findOne(options);
	}

	async findMany(options: FindManyOptions<T>): Promise<T[]> {
		return this.repository.find(options);
	}

	async createMany(data: DeepPartial<T>[]): Promise<T[]> {
		const entities = this.repository.create(data);
		return this.repository.save(entities);
	}

	async updateMany(
		criteria: FindOptionsWhere<T>,
		data: DeepPartial<T>,
	): Promise<boolean> {
		const result = await this.repository.update(
			criteria,
			data as Parameters<Repository<T>["update"]>[1],
		);
		return result.affected !== null && result.affected > 0;
	}

	async deleteMany(criteria: FindOptionsWhere<T>): Promise<boolean> {
		const result = await this.repository.delete(criteria);
		return result.affected !== null && result.affected > 0;
	}

	async softDeleteMany(criteria: FindOptionsWhere<T>): Promise<boolean> {
		const result = await this.repository.softDelete(criteria);
		return result.affected !== null && result.affected > 0;
	}

	// Helper method for custom queries
	createQueryBuilder(alias?: string) {
		return this.repository.createQueryBuilder(alias);
	}
}
