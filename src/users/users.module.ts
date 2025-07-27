import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "@/roles/models/role.entity";
import { User } from "./models/user.entity";
import { UserRepository } from "./user.repository";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User, Role])],
	providers: [UserResolver, UserService, UserRepository],
	exports: [UserService, UserRepository],
})
export class UserModule {}
