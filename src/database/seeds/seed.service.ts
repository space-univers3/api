import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { Role } from "@/roles/models/role.entity";

@Injectable()
export class SeedService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
	) {}

	async seedRoles(): Promise<void> {
		const existingRoles = await this.roleRepository.count();
		if (existingRoles > 0) {
			console.log("Roles already exist, skipping seed...");
			return;
		}

		const roles = [
			{
				name: "admin",
				description: "Administrator with full system access",
			},
			{
				name: "moderator",
				description: "Moderator with limited administrative privileges",
			},
			{
				name: "user",
				description: "Standard user with basic access",
			},
			{
				name: "guest",
				description: "Guest user with read-only access",
			},
		];

		console.log("Seeding roles...");

		for (const roleData of roles) {
			const role = this.roleRepository.create(roleData);
			await this.roleRepository.save(role);
			console.log(`✓ Created role: ${roleData.name}`);
		}

		console.log("Roles seeding completed!");
	}

	async seedAll(): Promise<void> {
		console.log("🌱 Starting database seeding...");

		try {
			await this.seedRoles();
			console.log("🎉 Database seeding completed successfully!");
		} catch (error) {
			console.error("❌ Error during database seeding:", error);
			throw error;
		}
	}

	async clearRoles(): Promise<void> {
		console.log("Clearing roles...");
		await this.roleRepository.delete({});
		console.log("✓ Roles cleared");
	}

	async clearAll(): Promise<void> {
		console.log("🧹 Clearing all data...");

		try {
			await this.clearRoles();
			// Add more clear methods here as needed
			// await this.clearUsers();
			// await this.clearCategories();

			console.log("✅ All data cleared successfully!");
		} catch (error) {
			console.error("❌ Error during data clearing:", error);
			throw error;
		}
	}

	async resetDatabase(): Promise<void> {
		console.log("🔄 Resetting database...");

		try {
			await this.clearAll();
			await this.seedAll();

			console.log("🎯 Database reset completed successfully!");
		} catch (error) {
			console.error("❌ Error during database reset:", error);
			throw error;
		}
	}
}
