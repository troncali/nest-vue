import { spawn } from "child_process";
import { DbEnvUrl } from "@libs/nest/config/db/src/lib/config.types";

/**
 * Wrapper for invoking `prisma` via command line. Sets the environment URL that
 * Prisma expects while preserving Docker secrets and other existing
 * configuration variables. Also enables the ability to implement more than one
 * Prisma Client and database.
 * @param args The command line arguments passed to Prisma.
 * @param connection Object containing the connection URL and environment
 * variable to which Prisma expects it to be assigned.
 */
export function PrismaWrapper(args: string[], connection: DbEnvUrl) {
	process.env[connection.envVar] = connection.url;

	const prisma = spawn("prisma", args, {
		stdio: "inherit"
	});

	prisma.on("spawn", () => {
		console.log(`Starting Prisma with environment wrapper`);
	});

	prisma.stdout?.on("data", (data) => {
		process.stdout.write(data);
	});

	prisma.stderr?.on("data", (data) => {
		process.stderr.write(data);
	});

	prisma.on("close", (code) => {
		console.log(`Prisma exited wrapper with code ${code}`);
	});
}
