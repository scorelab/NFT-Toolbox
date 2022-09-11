import { PathLike } from "fs";
import path from "path";
import { Collection } from "./Collection";

export abstract class FileStorage {
	abstract serviceBaseURL: string;
	abstract uploadDirToService(dir: PathLike): Promise<string>;
	abstract uploadFileToService(file: PathLike): Promise<string>;
	abstract uploadJSONToService(json: string): Promise<string>;

	async uploadCollection(
		collection: Collection
	): Promise<{ metadataCID: string; assetCID: string }> {
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
		return { metadataCID: MetaFolderCID, assetCID: ImageFolderCID };
	}

	async uploadSingle(
		asset: PathLike,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		metadata: any
	): Promise<{ metadataCID: string; assetCID: string }> {
		console.log("Uploading Asset...");
		const assetCID = await this.uploadFileToService(asset);

		metadata.image = `${this.serviceBaseURL}/${assetCID}`;
		console.log("Uploading Metadata...");
		const metadataCID = await this.uploadJSONToService(
			JSON.stringify(metadata)
		);
		console.log("Upload Complete");
		return { metadataCID, assetCID };
	}
}
