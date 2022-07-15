import { execSync } from "child_process";
import { Arweave } from "./classes/Arweave";
import { Collection, LayerSchema } from "./classes/Collection";
import { Infura } from "./classes/Infura";
import { IPFS } from "./classes/IPFS";
import { NFTstorage } from "./classes/NFTstorage";
import { Pinata } from "./classes/Pinata";
import { Storj } from "./classes/Storj";

class Toolbox {
	private collection: Collection | undefined = undefined;
	private ipfsService: IPFS | undefined = undefined;

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

	initIPFSService(attr: {
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
				this.ipfsService = new Pinata(attr.key, attr.secret);
				break;

			case "nft.storage":
				if (!attr.key) {
					throw new Error("NFT Storage API Key required");
				}
				execSync("npm install nft.storage files-from-path", {
					stdio: [0, 1, 2],
				});
				this.ipfsService = new NFTstorage(attr.key);
				break;

			case "storj":
				if (!attr.username) {
					throw new Error("STORJ Username required");
				}
				if (!attr.password) {
					throw new Error("STORJ Password required");
				}
				this.ipfsService = new Storj(attr.username, attr.password);
				break;

			case "arweave":
				if (!attr.wallet) {
					throw new Error("STORJ Username required");
				}
				execSync("npm install @bundlr-network/client", {
					stdio: [0, 1, 2],
				});
				this.ipfsService = new Arweave(attr.wallet);
				break;

			case "infura":
				if (!attr.username) {
					throw new Error("STORJ Username required");
				}
				if (!attr.password) {
					throw new Error("STORJ Password required");
				}
				this.ipfsService = new Infura(attr.username, attr.password);
				break;

			default:
				throw new Error("Unknown IPFS Service");
		}
	}

	uploadNFTs() {
		if (!this.collection) {
			throw new Error("No Collection is initialized");
		}
		if (!this.ipfsService) {
			throw new Error("No IPFS Service is initialized");
		}
		this.ipfsService.upload(this.collection);
	}
}

export const nftToolbox = new Toolbox();
