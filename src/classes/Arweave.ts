import fs from "fs";
import Bundlr from "@bundlr-network/client";
import { FileStorage } from "./FileStorage";
import path from "path";
const BigNumber = require("bignumber.js");

export class Arweave extends FileStorage {
	serviceBaseURL = "ar:/";

	BUNDLR_URL = "https://node1.bundlr.network";
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
		// Multiply by 1.1 to make sure we don't run out of funds
		const adjustedPrice = price.multipliedBy(1.1);

		if (adjustedPrice.isGreaterThan(balance)) {
			console.log("Funding Bundlr Node");
			// console.log(adjustedPrice.toString(), balance.toString());
			await this.CONNECTION.fund(
				adjustedPrice.minus(balance).integerValue(BigNumber.ROUND_CEIL)
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

		await this.fundBundlr(dirSize(dir.toString()));

		const response = await this.CONNECTION.uploader.uploadFolder(
			dir.toString()
		);
		//returns the manifest ID if successful.

		return response;
	}

	async uploadFileToService(file: fs.PathLike) {
		const data = fs.createReadStream(file);
		this.fundBundlr(fs.statSync(file).size);

		const response =
			await this.CONNECTION.uploader.chunkedUploader.uploadData(data);
		//returns the manifest ID if successful.

		return response.data.id;
	}

	async uploadJSONToService(json: string) {
		const data = Buffer.from(json);
		await this.fundBundlr(data.byteLength);

		const response =
			await this.CONNECTION.uploader.chunkedUploader.uploadData(data);
		//returns the manifest ID if successful.

		return response.data.id;
	}
}
