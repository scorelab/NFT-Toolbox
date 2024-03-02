import { PathLike } from "fs";
import path from "path";
import { Collection } from "./Collection";
import { Web3Stash } from "web3stash";

const web3Stash = new Web3Stash();

export abstract class FileStorage {
  abstract serviceBaseURL: string;
  async uploadDirToService(dir: PathLike): Promise<string> {
    const directoryData = this.readDirectory(dir);
    const directoryCID = await web3Stash.uploadDirectory(directoryData);
    return directoryCID;
  }

  async uploadFileToService(file: PathLike): Promise<string> {
    const fileData = this.readFile(file);
    const fileCID = await web3Stash.uploadFile(fileData);
    return fileCID;
  }

  async uploadJSONToService(json: string): Promise<string> {
    const jsonCID = await web3Stash.uploadJSON(json);
    return jsonCID;
  }
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
