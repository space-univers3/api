import { DataSource } from "typeorm";
import { runAllSeeders } from ".";

// You'll need to update this with your actual database configuration
const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: Number.parseInt(process.env.DB_PORT || "5432"),
	username: process.env.DB_USERNAME || "postgres",
	password: process.env.DB_PASSWORD || "password",
	database: process.env.DB_NAME || "universe_db",
	entities: ["src/**/*.entity.ts"],
	synchronize: false, // Set to false in production
	logging: true,
});

async function seed() {
	try {
		console.log("Connecting to database...");
		await AppDataSource.initialize();

		await runAllSeeders(AppDataSource);

		console.log("Seeding completed. Closing connection...");
		await AppDataSource.destroy();
		process.exit(0);
	} catch (error) {
		console.error("Seeding failed:", error);
		await AppDataSource.destroy();
		process.exit(1);
	}
}

seed();
