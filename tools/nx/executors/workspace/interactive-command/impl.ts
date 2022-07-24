// Based on Nx run-commands executor
// https://github.com/nrwl/nx/blob/master/packages/nx/src/executors/run-commands/run-commands.impl.ts

import { execSync } from "child_process";
import * as yargsParser from "yargs-parser";

export type Json = { [k: string]: any };

export interface InteractiveCommandOptions extends Json {
	command: string;
	cwd?: string;
	args?: string;
}

export interface NormalizedInteractiveCommandOptions
	extends InteractiveCommandOptions {
	commands: {
		command: string;
		forwardAllArgs?: boolean;
	}[];
	parsedArgs: { [k: string]: any };
}

const propKeys = ["command", "cwd", "args"];

export default async function buildExecutor(
	options: InteractiveCommandOptions
) {
	const normalized = normalizeOptions(options);

	execSync(normalized.commands[0].command, {
		cwd: normalized.cwd,
		stdio: ["inherit", "inherit", "inherit"],
		maxBuffer: 1024 * 1000000
	});

	return { success: true };
}

function normalizeOptions(
	options: InteractiveCommandOptions
): NormalizedInteractiveCommandOptions {
	options.parsedArgs = parseArgs(options);
	options.commands = [{ command: options.command }];

	(options as NormalizedInteractiveCommandOptions).commands.forEach((c) => {
		c.command = interpolateArgsIntoCommand(
			c.command,
			options as NormalizedInteractiveCommandOptions,
			true
		);
	});
	return options as any;
}

function parseArgs(options: { args?: string }) {
	const args = options.args;
	if (!args) {
		const unknownOptionsTreatedAsArgs = Object.keys(options)
			.filter((p) => propKeys.indexOf(p) === -1)
			.reduce((m, c) => ((m[c] = options[c]), m), {});
		return unknownOptionsTreatedAsArgs;
	}
	return yargsParser(args.replace(/(^"|"$)/g, ""), {
		configuration: { "camel-case-expansion": false }
	});
}

export function interpolateArgsIntoCommand(
	command: string,
	opts: NormalizedInteractiveCommandOptions,
	forwardAllArgs: boolean
) {
	if (command.indexOf("{args.") > -1) {
		const regex = /{args\.([^}]+)}/g;
		return command.replace(
			regex,
			(_, group: string) => opts.parsedArgs[group]
		);
	} else if (forwardAllArgs) {
		return `${command}${
			opts.__unparsed__.length > 0
				? " " + opts.__unparsed__.join(" ")
				: ""
		}`;
	} else {
		return command;
	}
}
