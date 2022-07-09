import path from "path";
import { nftToolbox } from "../src/index";

nftToolbox.initContract({
	name: "DemoContract",
	symbol: "DEMO",
	dir: path.join(__dirname, "Contracts"),
	standard: "ERC721",
});

nftToolbox.draftContract({
	baseUri: "ipfs://exampleCID/",
	mintable: true,
	incremental: true,
});

nftToolbox.deployContract({
	network: "rinkeby",
	provider: {
		etherscan: "dummy_API_KEY",
	},
	wallet: {
		privateKey: "dummy_PVT_KEY",
	},
});
