import { readFile } from "fs/promises";
import { readFileSync } from "fs";
import * as path from "path";

import { NestFastifyApplication } from "@nestjs/platform-fastify";

/**
 * Service for handling interactions with Docker.
 * @class
 */
export class DockerHandler {
	/**
	 * Read Docker secret from filesystem.
	 *
	 * @example async () => await getSecret("SECRET")
	 *
	 * @method
	 * @async
	 * @param {string} secretName Name of the Docker secret to read.
	 * @param {string} [pathFromProjectRoot] Relative path from the project root
	 * to the folder in which Docker secrets are located. Default:
	 * ```./src/docker/secrets```
	 *
	 * @throws DockerSecretReadError
	 *
	 * @return {Promise<string>} Contents of Docker secret.
	 */
	public static async getSecret(
		secretName: string,
		pathFromProjectRoot?: string
	): Promise<string> {
		const resolvedPath = this.resolveSecretPath(pathFromProjectRoot);
		return await readFile(`${resolvedPath}/${secretName}`, "utf8").catch(
			(e) => {
				throw new DockerSecretReadError(e, secretName, resolvedPath);
			}
		);
	}

	/**
	 * Read Docker secret synchronously from filesystem.
	 *
	 * @example const result = DockerHandler.getSecretSync("SECRET")
	 *
	 * @method
	 * @param {string} secretName Name of the Docker secret to read.
	 * @param {string} [pathFromProjectRoot] Relative path from the project root
	 * to the folder in which Docker secrets are located. Default:
	 * ```./src/docker/secrets```
	 *
	 * @throws DockerSecretReadError
	 *
	 * @return {string} Contents of Docker secret.
	 */
	public static getSecretSync(
		secretName: string,
		pathFromProjectRoot?: string
	): string {
		const resolvedPath = this.resolveSecretPath(pathFromProjectRoot);
		try {
			return readFileSync(`${resolvedPath}/${secretName}`, "utf8");
		} catch (e) {
			throw new DockerSecretReadError(e, secretName, resolvedPath);
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
		// Outside docker, use the default project location unless another is passed
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
}

/**
 * Create contextual error message on failure to read Docker secret.
 *
 * @example
 * catch (err) {
 * 	throw new DockerSecretReadError(err, "SECRET", "./src/docker/secrets")
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
class DockerSecretReadError {
	constructor(
		err: NodeJS.ErrnoException,
		secretName: string,
		pathFromProjectRoot: string
	) {
		if (err.code !== "ENOENT") {
			throw new Error(
				`Found the secret ${secretName}, but an error occurred while trying to read it. // ${err.message}`
			);
		} else {
			throw new Error(
				`Could not find the secret ${secretName} in ${pathFromProjectRoot}.`
			);
		}
	}
}

/** Available docker signals and their corresponding exit codes */
enum DockerSignals {
	"SIGHUP" = 1,
	"SIGINT" = 2,
	"SIGTERM" = 15
}
