import { PathLike } from "fs";
import { Collection, LayerSchema } from "./classes/Collection";
import { FileStorage } from "./classes/FileStorage";
import { execSync } from "child_process";
import { Arweave } from "./classes/Arweave";

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
		currency?: string;
		wallet?: any;
	}) {
		switch (attr.service) {
			case "arweave":
				if (!attr.wallet || !attr.currency) {
					throw new Error("Arweave Currency and Wallet required");
				}
				execSync("npm install @bundlr-network/client", {
					stdio: [0, 1, 2],
				});
				this.fileStorageService = new Arweave(
					attr.currency,
					attr.wallet
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
