import { registerAs } from "@nestjs/config";

export interface AppConfig {
	name: string;
	env: string;
	port: number;
	url: string;
	corsOrigins: string[];
}

export default registerAs(
	"app",
	(): AppConfig => ({
		name: process.env.APP_NAME || "Universe API",
		env: process.env.NODE_ENV || "development",
		port: Number.parseInt(process.env.PORT || "3000", 10),
		url: process.env.APP_URL || "http://localhost:3000",
		corsOrigins: process.env.CORS_ORIGINS?.split(",") || [
			"http://localhost:3000",
		],
	}),
);
