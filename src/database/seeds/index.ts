import type { DataSource } from "typeorm";
import { seedRoles } from "./role.seeder";

export async function runAllSeeders(dataSource: DataSource): Promise<void> {
	console.log("🌱 Starting database seeding...");

	try {
		await seedRoles(dataSource);
		console.log("🎉 Database seeding completed successfully!");
	} catch (error) {
		console.error("❌ Error during database seeding:", error);
		throw error;
	}
}
