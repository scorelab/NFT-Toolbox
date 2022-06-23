import fs from "fs";
import { NFTStorage } from "nft.storage";
import { filesFromPath } from "files-from-path";
import { Collection } from "./Collection";
import { IPFS } from "./IPFS";
import path from "path";

export class NFTstorage extends IPFS {
	nftStorageClient: NFTStorage;

	constructor(key: string) {
		super();
		this.nftStorageClient = new NFTStorage({ token: key });
	}

	async uploadDirToNFTStorage(dir: fs.PathLike) {
		const files = filesFromPath(dir.toString(), {
			pathPrefix: dir.toString(),
		});
		const cid = await this.nftStorageClient.storeDirectory(files);
		return cid;
	}

	async upload(collection: Collection) {
		console.log("Uploading Assets...");
		const ImageFolderCID = await this.uploadDirToNFTStorage(
			path.join(collection.dir.toString(), "assets")
		);
		collection.updateImageCID(ImageFolderCID);

		console.log("Uploading Metadata...");
		const MetaFolderCID = await this.uploadDirToNFTStorage(
			path.join(collection.dir.toString(), "metadata")
		);
		collection.setBaseURL(`ipfs://${MetaFolderCID}/`);

		console.log("Upload Complete");
	}
}
