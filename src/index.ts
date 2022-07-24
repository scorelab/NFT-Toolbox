import { Collection, LayerSchema } from "./classes/Collection";
import { FileStorage } from "./classes/FileStorage";

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
			default:
				throw new Error("Unknown IPFS Service");
		}
	}

	uploadNFTs() {
		if (!this.collection) {
			throw new Error("No Collection is initialized");
		}
		if (!this.fileStorageService) {
			throw new Error("No IPFS Service is initialized");
		}
		this.fileStorageService.upload(this.collection);
	}
}

export const nftToolbox = new Toolbox();
