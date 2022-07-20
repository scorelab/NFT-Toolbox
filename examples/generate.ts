import path from "path";
import { nftToolbox } from "../src/index";

nftToolbox.initCollection({
	name: "Demo Collection",
	dir: path.join(__dirname, "Demo Collection"),
	description: "This is a demo collection for NFT Toolbox",
});

nftToolbox.generateNFTs({
	dir: path.join(__dirname, "layers"),
	size: 100,
	layersOrder: [
		{ name: "background" },
		{ name: "first character" },
		{ name: "second character" },
		{ name: "third character" },
		{ name: "fourth character" },
	],
	format: {
		width: 512,
		height: 512,
		smoothing: true,
	},
	background: {
		generate: false,
	},
	dnaCollisionTolerance: 1000,
	rarityDelimiter: "#",
	rarityDefault: "1",
	shuffleIndexes: true,
});
