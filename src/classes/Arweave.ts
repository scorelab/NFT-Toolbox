import fs from "fs";
import Bundlr from "@bundlr-network/client";
import { FileStorage } from "./FileStorage";

export class Arweave extends FileStorage {
	serviceBaseURL = "ar:/";

	BUNDLR_URL = "http://node1.bundlr.network";
	CONNECTION: Bundlr;

	constructor(wallet: any) {
		super();
		this.CONNECTION = new Bundlr(this.BUNDLR_URL, "arweave", wallet);
	}

	async uploadDirToService(dir: fs.PathLike) {
		const response = await this.CONNECTION.uploader.uploadFolder(
			dir.toString()
		);
		//returns the manifest ID if successful.

		console.log(response);
		return response;
	}
}
