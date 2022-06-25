import fs from "fs";
import path from "path";
import pinataSDK, { PinataClient } from "@pinata/sdk";
import { Collection } from "./Collection";
import { IPFS } from "./IPFS";

export class Pinata extends IPFS {
	serviceBaseURL: string = "ipfs:/";
	pinataObj: PinataClient;

	constructor(key: string, security: string) {
		super();
		this.pinataObj = pinataSDK(key, security);
		this.pinataObj
			.testAuthentication()
			.then((result) => {
				//console.log(result);
			})
			.catch((err) => {
				console.log("Failed to initialize Pinata", err);
			});
	}

	async uploadDirToService(dir: fs.PathLike) {
		// PinataSDK is pinning entire absolute path to IPFS instead of One Folder
		// See issue https://github.com/PinataCloud/Pinata-SDK/issues/85

		try {
			const result = await this.pinataObj.pinFromFS(dir.toString());
			return result.IpfsHash;
		} catch (err) {
			console.error(err);
			throw new Error("Upload Failed");
		}
	}
}
