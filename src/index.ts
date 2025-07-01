import express from 'express';
import { createServer } from "http";
import * as dotenv from 'dotenv';

dotenv.config(); // Get env variables

const port = +(process.env.PORT || 0);

if (!port) {
	console.log("Port not defined properly, quitting...");
	process.exit(0);
}

const app = express();
const server = createServer(app);

let listenCount = 0;

app.get('/', (req, res) => {
	res.send("The start of something...");
	console.log("Served content", listenCount++, "times");
});

const shutdown = () => {
	console.log("Shutting down...");
	server.close(() => {
		console.log("Server closed, exiting...");
		process.exit(0);
	});
}

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
	process.on('SIGTERM', shutdown);
	process.on('SIGSTP', shutdown);
	process.on("SIGINT", shutdown);
});



