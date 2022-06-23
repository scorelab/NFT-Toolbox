import fs from "fs";
import path from "path";
import pinataSDK, { PinataClient } from "@pinata/sdk";
import { Collection } from "./Collection";
import { IPFS } from "./IPFS";

export class Pinata extends IPFS {
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

	async uploadDirToPinata(dir: fs.PathLike) {
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

	async upload(collection: Collection) {
		console.log("Uploading Assets...");
		const ImageFolderCID = await this.uploadDirToPinata(
			path.join(collection.dir.toString(), "assets")
		);
		collection.updateImageCID(ImageFolderCID);

		console.log("Uploading Metadata...");
		const MetaFolderCID = await this.uploadDirToPinata(
			path.join(collection.dir.toString(), "metadata")
		);
		collection.setBaseURL(`ipfs://${MetaFolderCID}/`);

		console.log("Upload Complete");
	}
}
