import fs from "fs";
import { NFTStorage, Blob } from "nft.storage";
import { filesFromPath } from "files-from-path";
import { FileStorage } from "./FileStorage";

export class NFTstorage extends FileStorage {
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

	async uploadFileToService(file: fs.PathLike) {
		const fileBinary = fs.readFileSync(file);
		const fileBlob = new Blob([fileBinary]);
		const cid = await this.nftStorageClient.storeBlob(fileBlob);
		return cid;
	}

	async uploadJSONToService(json: string) {
		const fileBlob = new Blob([json]);
		const cid = await this.nftStorageClient.storeBlob(fileBlob);
		return cid;
	}
}
