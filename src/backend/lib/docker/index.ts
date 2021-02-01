import { NestFastifyApplication } from "@nestjs/platform-fastify";

enum DockerSignals {
	"SIGHUP" = 1,
	"SIGINT" = 2,
	"SIGTERM" = 15
}

export function HandleDockerSignals(app: NestFastifyApplication): void {
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
				process.exit(128 + (<any>DockerSignals)[signal]);
			});
		}
	}
}
