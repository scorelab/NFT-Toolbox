import fs from "fs";
import Bundlr from "@bundlr-network/client";
import { FileStorage } from "./FileStorage";
import path from "path";

export class Arweave extends FileStorage {
	serviceBaseURL = "ar:/";

	BUNDLR_URL = "http://node1.bundlr.network";
	CONNECTION: Bundlr;

	constructor(currency: string, wallet: any) {
		super();
		this.CONNECTION = new Bundlr(this.BUNDLR_URL, currency, wallet);

		// For BUNDLR DEVNET
		// this.CONNECTION = new Bundlr("https://devnet.bundlr.network", currency, wallet, {
		// 	providerUrl: "https://rpc-mumbai.matic.today/"
		// });
	}

	async fundBundlr(dataSize: number) {
		const price = await this.CONNECTION.getPrice(dataSize);
		const balance = await this.CONNECTION.getLoadedBalance();

		if (price.multipliedBy(1.1).isGreaterThan(balance)) {
			console.log("Funding Bundlr Node");
			// Multiply by 1.1 to make sure we don't run out of funds
			await this.CONNECTION.fund(
				price.multipliedBy(1.1).minus(balance).integerValue()
			);
		}
	}

	async uploadDirToService(dir: fs.PathLike) {
		const dirSize = (directory: string) => {
			const files = fs.readdirSync(directory);
			const stats = files.map((file) =>
				fs.statSync(path.join(directory.toString(), file))
			);
			return stats.reduce((total, { size }) => total + size, 0);
		};

		this.fundBundlr(dirSize(dir.toString()));

		const response = await this.CONNECTION.uploader.uploadFolder(
			dir.toString()
		);
		//returns the manifest ID if successful.

		return response;
	}

	async uploadFileToService(file: fs.PathLike) {
		this.fundBundlr(fs.statSync(file).size);

		const response = await this.CONNECTION.uploader.uploadFile(
			file.toString()
		);
		//returns the manifest ID if successful.

		return response.data;
	}

	async uploadJSONToService(json: string) {
		const data = Buffer.from(json);
		this.fundBundlr(data.byteLength);

		const response = await this.CONNECTION.uploader.upload(data);
		//returns the manifest ID if successful.

		return response.data;
	}
}
