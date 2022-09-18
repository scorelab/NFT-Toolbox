import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { FileStorage } from "./FileStorage";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ndjsonParser = require("ndjson-parse");

export class Storj extends FileStorage {
	serviceBaseURL = "ipfs:/";

	URL = `https://www.storj-ipfs.com/api/v0/add`;
	AUTH: {
		username: string;
		password: string;
	};
	constructor(username: string, password: string) {
		super();
		this.AUTH = { username, password };
	}

	async uploadDirToService(dir: fs.PathLike): Promise<string> {
		const files = fs.readdirSync(dir);
		const formData = new FormData();
		files.forEach((file) => {
			const filepath = path.join(dir.toString(), file);
			formData.append(`file`, fs.createReadStream(filepath), {
				filepath,
			});
		});

		// Execute the Upload request to the Storj IPFS pinning service
		const response = await axios.post(this.URL, formData, {
			auth: this.AUTH,
			headers: {
				"Content-Type": `multipart/form-data; boundary= ${formData.getBoundary()}`,
			},
			// These arguments remove any client-side upload size restrictions
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});
		const responseArray = ndjsonParser(response.data);
		const dirResponse = responseArray.find(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(res: any) => res.Name === dir.toString().split("\\").join("/")
		);
		return dirResponse.Hash;
	}

	async uploadFileToService(filepath: fs.PathLike): Promise<string> {
		const formData = new FormData();
		formData.append(`file`, fs.createReadStream(filepath));

		// Execute the Upload request to the Storj IPFS pinning service
		const response = await axios.post(this.URL, formData, {
			auth: this.AUTH,
			headers: {
				"Content-Type": `multipart/form-data; boundary= ${formData.getBoundary()}`,
			},
			// These arguments remove any client-side upload size restrictions
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});
		return response.data.Hash;
	}

	async uploadJSONToService(json: string): Promise<string> {
		const formData = new FormData();
		formData.append(`file`, json);

		// Execute the Upload request to the Storj IPFS pinning service
		const response = await axios.post(this.URL, formData, {
			auth: this.AUTH,
			headers: {
				"Content-Type": `multipart/form-data; boundary= ${formData.getBoundary()}`,
			},
			// These arguments remove any client-side upload size restrictions
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});
		return response.data.Hash;
	}
}
