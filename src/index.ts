import { Collection, LayerSchema } from "./classes/Collection";
import { Contract, ContractAttributes, DraftOptions } from "./classes/Contract";

class Toolbox {
	private collection: Collection | undefined = undefined;
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

	initContract(attr: ContractAttributes) {
		this.contract = new Contract(attr);
	}

	draftContract(options: DraftOptions) {
		if (!this.contract) {
			throw new Error("No Contract is initialized");
		}
		this.contract.draft(options);
	}

	deployContract() {
		if (!this.contract) {
			throw new Error("No Contract is initialized");
		}
		this.contract.deploy();
	}

	async readContract(method: string, args: any[]) {
		if (!this.contract) {
			throw new Error("No Contract is initialized");
		}
		const res = await this.contract.read(method, args);
		return res;
	}

	async writeContract(method: string, args: any[]) {
		if (!this.contract) {
			throw new Error("No Contract is initialized");
		}
		const tx = await this.contract.write(method, args);
		return tx;
	}
}

export const nftToolbox = new Toolbox();
