import fs from "fs";
import pinataSDK, { PinataClient } from "@pinata/sdk";
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
				console.error("Failed to initialize Pinata", err);
				throw new Error("Pinata Initialization Failed");
			});
	}

	async uploadDirToService(dir: fs.PathLike) {
		// PinataSDK is pinning entire absolute path to IPFS instead of One Folder
		// See issue https://github.com/PinataCloud/Pinata-SDK/issues/85

		try {
			const result = await this.pinataObj.pinFromFS(dir.toString());
			const cid = result.IpfsHash;

			// Path containing unwanted folders pinned to IPFS
			const unwantedFolders = dir
				.toString()
				.slice(dir.toString().indexOf("\\"))
				.replace("\\", "/");

			return cid + unwantedFolders;
		} catch (err) {
			console.error(err);
			throw new Error("Upload Failed");
		}
	}
}
