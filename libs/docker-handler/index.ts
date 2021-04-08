import { readFile } from "fs/promises";
import { readFileSync } from "fs";
import * as path from "path";

import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { Logger } from "@nestjs/common";

/** Service for handling interactions with Docker. */
export class DockerHandler {
	/**
	 * Read Docker secret from filesystem.
	 *
	 * @example async () => await getSecret("SECRET")
	 *
	 * @param {string} secretName Name of the Docker secret to read.
	 * @param {DockerGetSecretOptions} [options] Options to apply when getting
	 * the Docker secret.
	 *
	 * @throws DockerSecretReadError
	 *
	 * @return {Promise<string | Buffer>} Contents of Docker secret.
	 */
	public static async getSecret(
		secretName: string,
		options: DockerGetSecretOptions & { returnType: "buffer" }
	): Promise<Buffer>;
	public static async getSecret(
		secretName: string,
		options?: DockerGetSecretOptions & { returnType?: "string" }
	): Promise<string>;
	public static async getSecret<T extends "string" | "buffer">(
		secretName: string,
		options?: DockerGetSecretOptions & { returnType?: T }
	): Promise<string | Buffer> {
		const secretPath = this.resolveSecretPath(options?.pathFromProjectRoot);
		try {
			return options?.returnType === "buffer"
				? await readFile(`${secretPath}/${secretName}`)
				: await readFile(`${secretPath}/${secretName}`, "utf8");
		} catch (e) {
			this.printReadError(e, secretName, secretPath);
			throw e;
		}
	}

	/**
	 * Read Docker secret synchronously from filesystem.
	 *
	 * @example const result = DockerHandler.getSecretSync("SECRET")
	 *
	 * @method
	 * @param {string} secretName Name of the Docker secret to read.
	 * @param {DockerGetSecretOptions} [options] Options to apply when getting
	 * the Docker secret.
	 *
	 * @throws DockerSecretReadError
	 *
	 * @return {(string | Buffer)} Contents of Docker secret.
	 */
	public static getSecretSync(
		secretName: string,
		options: DockerGetSecretOptions & { returnType: "buffer" }
	): Buffer;
	public static getSecretSync(
		secretName: string,
		options?: DockerGetSecretOptions & { returnType?: "string" }
	): string;
	public static getSecretSync<T extends "string" | "buffer">(
		secretName: string,
		options?: DockerGetSecretOptions & { returnType?: T }
	): string | Buffer {
		const secretPath = this.resolveSecretPath(options?.pathFromProjectRoot);
		try {
			return options?.returnType === "buffer"
				? readFileSync(`${secretPath}/${secretName}`)
				: readFileSync(`${secretPath}/${secretName}`, "utf8");
		} catch (e) {
			this.printReadError(e, secretName, secretPath);
			throw e;
		}
	}

	/**
	 * Generate absolute path to Docker secret.
	 *
	 * @method
	 * @param {string} [pathFromProjectRoot] Relative path from the project root
	 * to the folder in which Docker secrets are located. Default:
	 * ```./src/docker/secrets```.
	 * @returns {string} ```/run/secrets``` if ```DOCKER_ENV=true```;
	 * otherwise, absolute path to Docker secret on local filesystem.
	 */
	private static resolveSecretPath(pathFromProjectRoot?: string): string {
		// Use the default secret location for docker environments
		if (process.env.DOCKER_ENV === "true") return "/run/secrets";
		// Outside docker, use default project location unless another is passed
		if (!pathFromProjectRoot) pathFromProjectRoot = "./src/docker/secrets";
		return path.resolve(pathFromProjectRoot);
	}

	/**
	 * Gracefully stop server and docker container.
	 *
	 * @method
	 * @param {NestFastifyApplication} app The ```app``` instance.
	 * @returns {void}
	 */
	public static catchSignals(app: NestFastifyApplication): void {
		for (const signal in DockerSignals) {
			if (isNaN(Number(signal))) {
				process.on(signal, () => {
					console.log(`${signal} signal received from docker`);
					try {
						app.close();
						console.log(`Server closed`);
					} catch (e) {
						throw new Error(e);
					}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					process.exit(128 + (<any>DockerSignals)[signal]);
				});
			}
		}
	}

	/**
	 * Print contextual error message on failure to read Docker secret.
	 *
	 * @example
	 * catch (err) {
	 * 	printReadError(err, "SECRET", "./src/docker/secrets")
	 * }
	 *
	 * @class
	 * @param {NodeJS.ErrnoException} err - Default error thrown by NodeJS
	 * ```fs``` module.
	 * @param {string} secretName - Name of the Docker secret that failed to be
	 * read.
	 * @param {string} pathFromProjectRoot - Relative path used to look for the
	 * Docker secret.
	 *
	 * @return {void}}
	 */
	public static printReadError(
		err: NodeJS.ErrnoException,
		secretName: string,
		pathFromProjectRoot: string
	): void {
		err.code !== "ENOENT"
			? Logger.error(
					`Found the secret ${secretName}, but an error occurred ` +
						`while trying to read it. // ${err.message}`,
					undefined,
					"DockerHandler"
			  )
			: Logger.error(
					`Could not find the secret ${secretName} in ` +
						`${pathFromProjectRoot}.`,
					undefined,
					"DockerHandler"
			  );
	}
}

/** Available docker signals and their corresponding exit codes */
enum DockerSignals {
	"SIGHUP" = 1,
	"SIGINT" = 2,
	"SIGTERM" = 15
}

/** Options to apply when getting the Docker secret. */
interface DockerGetSecretOptions {
	/** Relative path from the project root to the folder in which Docker
	 * secrets are located. Default: ```./src/docker/secrets```. */
	pathFromProjectRoot?: string;
	/** Whether to return the Docker secret as a string or buffer. */
	returnType?: "string" | "buffer";
}
