import { readFileSync } from "fs";
import path from "path";
import { nftToolbox } from "../src/index";

nftToolbox.initContract({
	name: "DemoContract",
	symbol: "DEMO",
	dir: path.join(__dirname, "Contracts"),
	standard: "ERC721",
	connection: JSON.parse(
		readFileSync(path.join(__dirname, "connection.json")).toString()
	),
});

nftToolbox.draftContract({
	baseUri: "ipfs://exampleCID/",
	mintable: true,
	incremental: true,
});
