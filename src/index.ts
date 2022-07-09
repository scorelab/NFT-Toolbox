import { ERC1155Options } from "@openzeppelin/wizard/dist/erc1155";
import { ERC721Options } from "@openzeppelin/wizard/dist/erc721";
import { execSync } from "child_process";
import { Arweave } from "./classes/Arweave";
import { Collection, LayerSchema } from "./classes/Collection";
<<<<<<< HEAD
import {
	Contract,
	ContractAttributes,
	DraftOptions,
	DeployConfigs,
} from "./classes/Contract";
=======
import { Contract, ContractAttributes } from "./classes/Contract";
>>>>>>> f757f5fe579d141132818fe2f65ef0e156361de9
import { Infura } from "./classes/Infura";
import { IPFS } from "./classes/IPFS";
import { NFTstorage } from "./classes/NFTstorage";
import { Pinata } from "./classes/Pinata";
import { Storj } from "./classes/Storj";

class Toolbox {
	private collection: Collection | undefined = undefined;
	private ipfsService: IPFS | undefined = undefined;
	private contract: Contract | undefined = undefined;

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

	initContract(attr: ContractAttributes) {
		this.contract = new Contract(attr);
	}

<<<<<<< HEAD
	draftContract(options: DraftOptions) {
=======
	draftContract(options: {
		baseUri: string;
		// Common options
		burnable?: boolean;
		pausable?: boolean;
		mintable?: boolean;
		// ERC721 options
		enumerable?: boolean;
		uriStorage?: boolean;
		incremental?: boolean;
		votes?: boolean;
		// ERC1155 options
		supply?: boolean;
		updatableUri?: boolean;
	}) {
>>>>>>> f757f5fe579d141132818fe2f65ef0e156361de9
		if (!this.contract) {
			throw new Error("No Contract is initialized");
		}
		this.contract.draft(options);
	}
<<<<<<< HEAD

	deployContract(options: DeployConfigs) {
		if (!this.contract) {
			throw new Error("No Contract is initialized");
		}
		this.contract.deploy(options);
	}
=======
>>>>>>> f757f5fe579d141132818fe2f65ef0e156361de9
}

export const nftToolbox = new Toolbox();
