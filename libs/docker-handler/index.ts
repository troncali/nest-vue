import { readFile } from "fs/promises";
import { readFileSync } from "fs";
import * as path from "path";

/**
 * Service for handling interactions with the Docker container in which an
 * application is running.
 */
export class DockerHandler {
	static _envFlag = "DOCKER_ENV";
	static _secretsDir = "/run/secrets";
	static _localDir = "./src/docker/secrets";
	static _appCloseMethod = "close";

	/**
	 * Optionally overrides default values used by DockerHandler for environment
	 * and directory variables.
	 *
	 * @example DockerHandler.setup({ envFlag: "DOCKER_ENV" })
	 *
	 * @param {DockerHandlerOptions} options Values to use in place of
	 * DockerHandler's default environment and directory variables.
	 */
	public static setup(options: DockerHandlerOptions): void {
		this._envFlag = options.envFlag || this._envFlag;
		this._secretsDir = options.containerSecretsDir || this._secretsDir;
		this._localDir = options.localSecretsDir || this._localDir;
		this._appCloseMethod = options.appCloseMethod || this._appCloseMethod;
	}

	/**
	 * Read Docker secret from file system.
	 *
	 * @example const result = async () => await DockerHandler.getSecret("SECRET")
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
	 * Read Docker secret synchronously from file system.
	 *
	 * @example const result = DockerHandler.getSecretSync("SECRET")
	 *
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
	 * @param {string} [pathFromProjectRoot] Relative path from the project root
	 * to the folder in which Docker secrets are located. Default:
	 * `./src/docker/secrets`; override default with
	 * `DockerHandler.setup({ localSecretsDir: "./the/path" })`.
	 *
	 * @returns {string} Absolute path to Docker secret on local file system, or
	 * container path if running in one. Default container path:`/run/secrets`.
	 * Default container flag: `DOCKER_ENV=true`. Override defaults with
	 * `DockerHandler.setup({ envFlag: "THE_VAR", containerSecretsDir: "/the/path" })`.
	 */
	private static resolveSecretPath(pathFromProjectRoot?: string): string {
		// Use the default secret location for docker environments
		if (process.env[this._envFlag] === "true") return this._secretsDir;
		// Outside docker, use default project location unless another is passed
		if (!pathFromProjectRoot) pathFromProjectRoot = this._localDir;
		return path.resolve(pathFromProjectRoot);
	}

	/**
	 * Gracefully close the target application and stop the docker container.
	 * Requires the `app` instance to implement a `close` method, if it does not
	 * already have one. Default method name: `close`. Override with
	 * `DockerHandler.setup({ appCloseMethod: "methodName" })`.
	 *
	 * @param {NestFastifyApplication} app The `app` instance.
	 */
	public static catchSignals(app: RunningAppInstance): void {
		if (!app[this._appCloseMethod])
			throw new Error(
				`DockerHandler: target application instance must implement a ` +
					`${this._appCloseMethod}() method.`
			);

		for (const signal in DockerSignals) {
			if (isNaN(Number(signal))) {
				process.on(signal, () => {
					console.log(`${signal} signal received from docker`);
					try {
						app[this._appCloseMethod]();
						console.log(`Application closed`);
					} catch (e) {
						throw new Error(e);
					}
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
	 * @param {NodeJS.ErrnoException} err Default error thrown by NodeJS
	 * `fs` module.
	 * @param {string} secretName Name of the Docker secret that failed to be
	 * read.
	 * @param {string} pathFromProjectRoot Relative path used to look for the
	 * Docker secret.
	 */
	public static printReadError(
		err: NodeJS.ErrnoException,
		secretName: string,
		pathFromProjectRoot: string
	): void {
		err.code !== "ENOENT"
			? console.log(
					`DockerHandler: Found the secret ${secretName}, but an ` +
						`error occurred while trying to read it. // ` +
						`${err.message}`
			  )
			: console.log(
					`DockerHandler: Could not find the secret ${secretName} ` +
						`in ${pathFromProjectRoot}.`
			  );
	}
}

/** Available docker signals and their corresponding exit codes */
export enum DockerSignals {
	"SIGHUP" = 1,
	"SIGINT" = 2,
	"SIGTERM" = 15
}

/** Values to use in place of DockerHandler's default environment and directory
 * variables. */
export interface DockerHandlerOptions {
	/** Name of the environment variable that, when set to true, indicates the
	 *  application is running in a Docker container. Default: `DOCKER_ENV`. */
	envFlag?: string;
	/** Full path of the folder in which Docker secrets are located in the
	 *  container. Default: `/run/secrets/`. */
	containerSecretsDir?: string;
	/** Relative path of the local folder in which Docker secrets are located
	 *  for development, from project root. Default: `./src/docker/secrets/`. */
	localSecretsDir?: string;
	/** Name of the method on the target app instance that will close it
	 *  gracefully (e.g., stop the server). Default: `close`. */
	appCloseMethod?: string;
}

/** Options to apply when getting the Docker secret. */
export interface DockerGetSecretOptions {
	/**
	 * Relative path from the project root to the folder in which Docker
	 * secrets are located. Default: `./src/docker/secrets`; override default
	 * with `DockerHandler.setup({ localSecretsDir: "./the/path" })`.
	 */
	pathFromProjectRoot?: string;
	/** Whether to return the Docker secret as a string or buffer. */
	returnType?: "string" | "buffer";
}

export interface RunningAppInstance {
	/** Default name of the method used to close the application instance
	 *  (e.g., stop the server). */
	close?: Function;
	[key: string]: any;
}

// TODO: add typing for secrets, and get all secrets in dir? (typescript generics, see https://github.com/hwkd/docker-secret/blob/master/src/index.ts)
