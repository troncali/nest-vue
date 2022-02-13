var http = require("http");
var process = require("process");

const server = http
	.createServer(function (request, response) {
		if (request.url == "/api" && request.method == "GET") {
			response.writeHead(200, { "Content-Type": "text/plain" });
			response.write("Placeholder");
			response.end();
		} else {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.write("Not Found");
			response.end();
		}
	})
	.listen(3001);

const stopContainer = () => {
	server.close();
	process.exit(0);
};

["SIGINT", "SIGHUP", "SIGTERM"].forEach((signal) => {
	process.on(signal, stopContainer);
});
