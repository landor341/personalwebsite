import express from 'express';
import { createServer } from "http";
import * as dotenv from 'dotenv';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import { markdownToHtml } from "ts-markdown-parser";

dotenv.config(); // Get env variables

const port = +(process.env.PORT || 0);

if (!port) {
	console.log("Port not defined properly, quitting...");
	process.exit(0);
}

const app = express();
const server = createServer(app);

let listenCount = 0;

// app.get('/', (req, res) => {
// 	res.send("The start of something...");
// 	console.log("Served content", listenCount++, "times");
// });
1
const preprocessMDPages = async () => {
	// const dir = await fs.opendir("static/markdown");
	// for await (const entry of dir) {
	// 	// TODO: Process documents with handlebars
	// 	Handlebars.precompile()
	// }
	const template = (await fs.readFile("src/templates/mdTemplate.hbs")).toString();
	const mdContent = markdownToHtml(await (await fs.readFile("src/markdown/home.md")).toString());
	const documentConfig = {
		mdContent,
		backgroundImage: "/resources/images/scenery/home.JPG"
	}
	const document = Handlebars.compile(template);
	fs.writeFile("static/home.html", document(documentConfig));
}
preprocessMDPages().then(() => {
	const options = { index: "home.html" };
	app.use('/', express.static('static', options));
	app.use('/resources/images', express.static('static/images'))


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
});



