import { PathLike } from "fs";
import { Collection, LayerSchema } from "./classes/Collection";
import { FileStorage } from "./classes/FileStorage";
import { NFTstorage } from "./classes/NFTstorage";
import { Pinata } from "./classes/Pinata";
import { execSync } from "child_process";

class Toolbox {
	private collection: Collection | undefined = undefined;
	private fileStorageService: FileStorage | undefined = undefined;

	initCollection(attr: { name: string; dir: string; description?: string }) {
		this.collection = new Collection({
			name: attr.name,
			dir: attr.dir,
			description: attr.description ? attr.description : "",
		});
	}

	generateNFTs(schema: LayerSchema) {
		if (!this.collection) {
			throw new Error("No Collection is initialized");
		}
		this.collection.setSchema(schema);
		this.collection.generate();
	}

	initFileStorageService(attr: {
		service: string;
		key?: string;
		secret?: string;
		username?: string;
		password?: string;
		wallet?: any;
	}) {
		switch (attr.service) {
			case "pinata":
				if (!attr.key || !attr.secret) {
					throw new Error("Pinata API Key and Security required");
				}
				execSync("npm install @pinata/sdk", { stdio: [0, 1, 2] });
				this.fileStorageService = new Pinata(attr.key, attr.secret);
				break;

			case "nft.storage":
				if (!attr.key) {
					throw new Error("NFT Storage API Key required");
				}
				execSync("npm install nft.storage files-from-path", {
					stdio: [0, 1, 2],
				});
				this.fileStorageService = new NFTstorage(attr.key);
				break;

			default:
				throw new Error("Unknown IPFS Service");
		}
	}

	uploadCollectionNFT() {
		if (!this.collection) {
			throw new Error("No Collection is initialized");
		}
		if (!this.fileStorageService) {
			throw new Error("No IPFS Service is initialized");
		}
		this.fileStorageService.uploadCollection(this.collection);
	}

	uploadSingleNFT(asset: PathLike, metadata: any) {
		if (!this.fileStorageService) {
			throw new Error("No IPFS Service is initialized");
		}
		this.fileStorageService.uploadSingle(asset, metadata);
	}
}

export const nftToolbox = new Toolbox();
