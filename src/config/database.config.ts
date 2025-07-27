import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	url?: string;
	ssl: boolean;
	synchronize: boolean;
	logging: boolean;
	maxConnections: number;
	idleTimeout: number;
	connectionTimeout: number;
}

export default registerAs(
	"database",
	(): DatabaseConfig => ({
		host: process.env.POSTGRES_HOST,
		port: Number.parseInt(process.env.POSTGRES_PORT, 10),
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		url: process.env.POSTGRES_URL,
		ssl:
			process.env.NODE_ENV === "production" ||
			process.env.POSTGRES_URL?.includes("sslmode=require") ||
			false,
		synchronize: process.env.NODE_ENV === "development",
		logging:
			process.env.NODE_ENV !== "production" ||
			process.env.DB_LOGGING === "true",
		maxConnections: Number.parseInt(process.env.DB_MAX_CONNECTIONS || "10", 10),
		idleTimeout: Number.parseInt(process.env.DB_IDLE_TIMEOUT || "30000", 10),
		connectionTimeout: Number.parseInt(
			process.env.DB_CONNECTION_TIMEOUT || "2000",
			10,
		),
	}),
);
