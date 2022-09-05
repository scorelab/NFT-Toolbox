import path from "path";
import fs from "fs";
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
	deployed: {
		address: "0x5009278830fB58551bD518157cBb0002eB5DC80E",
		abi: JSON.parse(
			fs
				.readFileSync(
					path.join(__dirname, "Contracts", "DemoContractAbi.json")
				)
				.toString()
		),
	},
});

const demoMintNFT = async () => {
	const address = "0x7304Cf13eEE8c8C20C6569E2024fB9079184F430";

	let bal = await nftToolbox.readContract("balanceOf", [address]);
	console.log(bal.toString());
	const tx = await nftToolbox.writeContract("safeMint", [address]);
	await tx.wait();
	bal = await nftToolbox.readContract("balanceOf", [address]);
	console.log(bal.toString());
};

demoMintNFT();
