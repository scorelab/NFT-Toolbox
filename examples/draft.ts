import path from "path";
import { nftToolbox } from "../src/index";

nftToolbox.initContract({
	name: "DemoContract",
	symbol: "DEMO",
	dir: path.join(__dirname, "Contracts"),
	standard: "ERC721",
});

nftToolbox.draftContract({
	baseUri: "ipfs://",
	mintable: true,
	incremental: true,
});
