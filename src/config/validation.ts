import Joi from "joi";

export const validationSchema = Joi.object({
	// App
	NODE_ENV: Joi.string()
		.valid("development", "production", "test")
		.default("development"),
	PORT: Joi.number().default(3000),
	APP_NAME: Joi.string().default("Universe API"),
	APP_URL: Joi.string().default("http://localhost:3000"),
	API_PREFIX: Joi.string().default("api"),
	CORS_ORIGINS: Joi.string().default("http://localhost:3000"),

	// Database
	POSTGRES_HOST: Joi.string().required(),
	POSTGRES_PORT: Joi.number().default(5432),
	POSTGRES_USER: Joi.string().required(),
	POSTGRES_PASSWORD: Joi.string().required(),
	POSTGRES_DB: Joi.string().required(),
	POSTGRES_URL: Joi.string().optional(),

	// Database Behavior
	DB_SYNCHRONIZE: Joi.boolean().default(false),
	DB_LOGGING: Joi.boolean().default(true),
	DB_MAX_CONNECTIONS: Joi.number().default(10),
	DB_IDLE_TIMEOUT: Joi.number().default(30000),
	DB_CONNECTION_TIMEOUT: Joi.number().default(2000),

	// JWT
	JWT_SECRET: Joi.string().required(),
	JWT_EXPIRES_IN: Joi.string().default("15m"),
	JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),
});
