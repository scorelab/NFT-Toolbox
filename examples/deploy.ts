import path from "path";
import { nftToolbox } from "../src/index";

nftToolbox.initContract({
	name: "DemoContract",
	symbol: "DEMO",
	dir: path.join(__dirname, "Contracts"),
	standard: "ERC721",
	connection: {
		network: "rinkeby",
		provider: {
			infura: {
				projectId: "ad8d113a8af144169f7941c14b1a4578",
				projectSecret: "eaf0b3b238934df58354d6cfabea489c",
			},
		},
		wallet: {
			privateKey:
				"e70c22ca3f3c257f35cc91e64e4e84847fc3f5ca6fe9d775a5254c8ea27a9d3e",
		},
	},
});

nftToolbox.draftContract({
	baseUri: "ipfs://exampleCID/",
	mintable: true,
	incremental: true,
});

nftToolbox.deployContract();
