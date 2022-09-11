import path from "path";
import fs from "fs";
import { nftToolbox } from "../src/index";

nftToolbox.initContract({
	name: "DemoContract",
	symbol: "DEMO",
	dir: path.join(__dirname, "Contracts"),
	standard: "ERC721",
	connection: JSON.parse(
		fs.readFileSync(path.join(__dirname, "connection.json")).toString()
	),
	deployed: {
		address: "0x5009278830fB58551bD518157cBb0002eB5DC80E",
		abi: fs.readFileSync(path.join(__dirname, "abi.json")).toString(),
	},
});

const demoMintNFT = async () => {
	const address = "0x7304Cf13eEE8c8C20C6569E2024fB9079184F430";

	let bal = await nftToolbox.readContract("balanceOf", [address]);
	console.log("Balance: ", bal.toString());

	console.log("Minting New Token");
	const tx = await nftToolbox.writeContract("safeMint", [address]);
	await tx.wait();

	bal = await nftToolbox.readContract("balanceOf", [address]);
	console.log("Balance: ", bal.toString());
};

demoMintNFT();
