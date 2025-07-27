import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cors from "cors";
import type { AppConfig } from "@/config/app.config";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const appConfig = configService.get<AppConfig>("app");

	// Enable CORS
	app.enableCors({
		origin: appConfig?.corsOrigins || ["http://localhost:3000"],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
		allowedHeaders: "Content-Type, Accept, Authorization",
		credentials: true,
	});
	app.use(
		"/graphql",
		cors<cors.CorsRequest>({
			origin: "localhost",
			credentials: true,
		}),
	);

	// Global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	const port = appConfig?.port || 3000;
	await app.listen(port);

	console.log(
		`🚀 ${appConfig?.name || "Application"} is running on: ${await app.getUrl()}`,
	);
}

bootstrap().catch((error) => {
	console.error("❌ Error starting application:", error);
	process.exit(1);
});
