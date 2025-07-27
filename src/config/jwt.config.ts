import { registerAs } from "@nestjs/config";

export interface JwtConfig {
	secret: string;
	expiresIn: string;
	refreshExpiresIn: string;
}

export default registerAs(
	"jwt",
	(): JwtConfig => ({
		secret: process.env.JWT_SECRET || "fallback-secret-key",
		expiresIn: process.env.JWT_EXPIRES_IN || "15m",
		refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
	}),
);
