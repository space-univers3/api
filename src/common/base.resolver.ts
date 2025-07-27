import { ParseUUIDPipe } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { DeepPartial } from "typeorm";
import type { BaseEntity } from "./base.repository";
import type { BaseService } from "./base.service";

@Resolver({
	isAbstract: true,
})
export abstract class BaseResolver<
	TEntity extends BaseEntity,
	TCreateInput = Record<string, unknown>,
	TUpdateInput extends { id: string } = Record<string, unknown> & {
		id: string;
	},
> {
	constructor(
		protected readonly service: BaseService<TEntity>,
		protected readonly entityClass: new () => TEntity,
	) {}

	async findAll(): Promise<TEntity[]> {
		return this.service.findAll();
	}

	async findById(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
	): Promise<TEntity> {
		return this.service.findById(id);
	}

	async count(): Promise<number> {
		return this.service.count();
	}

	@Query(() => Boolean, {
		name: "exists",
		description: "Check if entity exists by ID",
	})
	async exists(
		@Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
	): Promise<boolean> {
		return this.service.exists(id);
	}

	abstract create(input: TCreateInput): Promise<TEntity>;

	abstract update(input: TUpdateInput): Promise<TEntity>;

	abstract delete(id: string): Promise<boolean>;

	abstract softDelete(id: string): Promise<boolean>;

	abstract restore(id: string): Promise<boolean>;

	protected getEntityName(): string {
		return this.entityClass.name.toLowerCase();
	}
}
