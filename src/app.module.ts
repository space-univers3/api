import { join } from "node:path";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import configs from "@/config";
import type { AppConfig } from "@/config/app.config";
import type { DatabaseConfig } from "@/config/database.config";
import { validationSchema } from "@/config/validation";
import { AppService } from "./app.service";
import { Role } from "./roles";
import { User, UserModule } from "./users";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      validationSchema,
      envFilePath: ".env.local",
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>("database");
        const appConfig = configService.get<AppConfig>("app");
        console.log("Database URL:", dbConfig?.url);
        console.log("Config: ", dbConfig);
        return {
          type: "postgres",
          host: dbConfig?.host,
          port: dbConfig?.port,
          username: dbConfig?.username,
          password: dbConfig?.password,
          database: dbConfig?.database,
          url: dbConfig?.url,
          entities: [User, Role],
          synchronize: appConfig?.env !== "production" && dbConfig?.synchronize,
          logging: appConfig?.env !== "production" && dbConfig?.logging,
          ssl: dbConfig?.ssl
            ? {
                rejectUnauthorized: false,
              }
            : false,
        };
      },
    }),
    // GraphQL
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<AppConfig>("app");
        const isDevelopment = appConfig?.env !== "production";

        return {
          autoSchemaFile: join(process.cwd(), "src/schema.graphql"),
          sortSchema: true,
          playground: true,
          introspection: isDevelopment,
          installSubscriptionHandlers: true,
          schemas: true,
          csrfPrevention: false,

          cache: "bounded",
          path: "/graphql",
          graphiql: true,
          context: ({ req, res }) => ({ req, res }),
          formatError: (formattedError) => {
            console.error("GraphQL Error:", formattedError);
            const originalError = formattedError.extensions
              ?.originalError as Record<string, unknown> | null;
            if (originalError)
              return {
                message:
                  (originalError?.message as string) || "Internal server error",
                statusCode: originalError?.statusCode || 500,
              };
            return formattedError;
          },
        };
      },
    }),
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
