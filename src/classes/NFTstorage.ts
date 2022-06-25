import fs from "fs";
import { NFTStorage } from "nft.storage";
import { filesFromPath } from "files-from-path";
import { IPFS } from "./IPFS";

export class NFTstorage extends IPFS {
	serviceBaseURL: string = "ipfs:/";
	nftStorageClient: NFTStorage;

	constructor(key: string) {
		super();
		this.nftStorageClient = new NFTStorage({ token: key });
	}

	async uploadDirToService(dir: fs.PathLike) {
		const files = filesFromPath(dir.toString(), {
			pathPrefix: dir.toString(),
		});
		const cid = await this.nftStorageClient.storeDirectory(files);
		return cid;
	}
}
