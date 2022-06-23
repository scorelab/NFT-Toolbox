import { PluginManager } from "live-plugin-manager";
import { Collection } from "./Collection";

export abstract class IPFS {
	async upload(collection: Collection) {}
}
