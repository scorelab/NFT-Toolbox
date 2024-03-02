import fs from "fs";
import pinataSDK, { PinataClient } from "@pinata/sdk";
import { FileStorage } from "./FileStorage";

export class Pinata extends FileStorage {
	serviceBaseURL = "ipfs:/";
	pinataObj: PinataClient;

	constructor(key: string, security: string) {
		super();
		this.pinataObj = pinataSDK(key, security);
		this.pinataObj.testAuthentication().catch((err) => {
			console.error("Failed to initialize Pinata", err);
			throw new Error("Pinata Initialization Failed");
		});
	}

	async uploadDirToService(dir: fs.PathLike): Promise<string> {
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

	async uploadFileToService(file: fs.PathLike): Promise<string> {
		const readStream = fs.createReadStream(file);
		const result = await this.pinataObj.pinFileToIPFS(readStream);
		const cid = result.IpfsHash;
		return cid;
	}

	async uploadJSONToService(json: string): Promise<string> {
		const result = await this.pinataObj.pinJSONToIPFS(JSON.parse(json));
		const cid = result.IpfsHash;
		return cid;
	}
}
