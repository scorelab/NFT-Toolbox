import { PathLike } from "fs";
import path from "path";
import { Collection } from "./Collection";

export abstract class IPFS {
	abstract serviceBaseURL: string;
	abstract uploadDirToService(dir: PathLike): Promise<string>;

	async upload(collection: Collection) {
		console.log("Uploading Assets...");
		const ImageFolderCID = await this.uploadDirToService(
			path.join(collection.dir.toString(), "assets")
		);

		collection.setBaseURL(this.serviceBaseURL);
		collection.setAssetsDirCID(ImageFolderCID);
		collection.updateMetadataWithCID();

		console.log("Uploading Metadata...");
		const MetaFolderCID = await this.uploadDirToService(
			path.join(collection.dir.toString(), "metadata")
		);

		collection.setMetadataDirCID(MetaFolderCID);

		console.log("Upload Complete");
	}
}
