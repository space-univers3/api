import { Injectable, NotFoundException } from "@nestjs/common";
import type { DeepPartial, FindManyOptions, FindOneOptions } from "typeorm";
import type { BaseEntity, BaseRepository } from "./base.repository";

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
	constructor(protected readonly repository: BaseRepository<T>) {}

	async findAll(options?: FindManyOptions<T>): Promise<T[]> {
		return this.repository.findAll(options);
	}

	async findById(id: string, options?: FindOneOptions<T>): Promise<T> {
		const entity = await this.repository.findById(id, options);
		if (!entity) {
			throw new NotFoundException(
				`${this.getEntityName()} with ID ${id} not found`,
			);
		}
		return entity;
	}

	async findByIdOrNull(
		id: string,
		options?: FindOneOptions<T>,
	): Promise<T | null> {
		return this.repository.findById(id, options);
	}

	async findOne(options: FindOneOptions<T>): Promise<T | null> {
		return this.repository.findOne(options);
	}

	async findMany(options: FindManyOptions<T>): Promise<T[]> {
		return this.repository.findMany(options);
	}

	async create(data: DeepPartial<T>): Promise<T> {
		// Override in child classes for validation logic
		return this.repository.create(data);
	}

	async createMany(data: DeepPartial<T>[]): Promise<T[]> {
		return this.repository.createMany(data);
	}

	async update(id: string, data: DeepPartial<T>): Promise<T> {
		// Check if entity exists before updating
		await this.findById(id);

		const updatedEntity = await this.repository.update(id, data);
		if (!updatedEntity) {
			throw new NotFoundException(
				`${this.getEntityName()} with ID ${id} not found after update`,
			);
		}

		return updatedEntity;
	}

	async delete(id: string): Promise<boolean> {
		// Check if entity exists before deleting
		await this.findById(id);
		return this.repository.delete(id);
	}

	async softDelete(id: string): Promise<boolean> {
		// Check if entity exists before soft deleting
		await this.findById(id);
		return this.repository.softDelete(id);
	}

	async restore(id: string): Promise<boolean> {
		return this.repository.restore(id);
	}

	async count(options?: FindManyOptions<T>): Promise<number> {
		return this.repository.count(options);
	}

	async exists(id: string): Promise<boolean> {
		return this.repository.exists(id);
	}

	// Abstract method to get entity name for error messages
	protected abstract getEntityName(): string;
}
