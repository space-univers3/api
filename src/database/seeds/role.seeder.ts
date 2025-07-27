import type { DataSource } from "typeorm";
import { Role } from "@/roles/models/role.entity";

export async function seedRoles(dataSource: DataSource): Promise<void> {
	const roleRepository = dataSource.getRepository(Role);

	// Check if roles already exist to avoid duplicates
	const existingRoles = await roleRepository.count();
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
		const role = roleRepository.create(roleData);
		await roleRepository.save(role);
		console.log(`✓ Created role: ${roleData.name}`);
	}

	console.log("Roles seeding completed!");
}
