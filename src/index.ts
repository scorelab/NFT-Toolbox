import { PathLike } from "fs";
import { Collection, LayerSchema } from "./classes/Collection";
import { FileStorage } from "./classes/FileStorage";
import { execSync } from "child_process";
import { Infura } from "./classes/Infura";
import { Storj } from "./classes/Storj";

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
			case "storj":
				if (!attr.username) {
					throw new Error("STORJ Username required");
				}
				if (!attr.password) {
					throw new Error("STORJ Password required");
				}
				execSync("npm install ndjson-parse", {
					stdio: [0, 1, 2],
				});
				this.fileStorageService = new Storj(
					attr.username,
					attr.password
				);
				break;

			case "infura":
				if (!attr.username) {
					throw new Error("INFURA Username required");
				}
				if (!attr.password) {
					throw new Error("INFURA Password required");
				}
				execSync("npm install ndjson-parse", {
					stdio: [0, 1, 2],
				});
				this.fileStorageService = new Infura(
					attr.username,
					attr.password
				);
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
