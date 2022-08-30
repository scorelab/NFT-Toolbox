import path from "path";
import { nftToolbox } from "../src/index";

const accounts = {
	PINATA_KEY: "c035310605551a107fb5",
	PINATA_SECURITY:
		"23bfd7200d9c4376738ee232bfc06baf533b2d53c75f524f6461d7f7d8fa25b6",
	NFT_STORAGE_KEY:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGIwNzFBZTU0Q0RFNmQ2MDZBNDU2N0Y2QzE2NzQ3NDNBN2E4NzdlQjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NTkyMTY1Mzg5OCwibmFtZSI6Ik5GVCBUb29sYm94IERlbW8ifQ.sKGyyKdhvsfFhB399DNrHJtJcS5vLeAvWnAdAziuc3I",
	STORJ_USERNAME: "username",
	STORJ_PASSWORD: "password",
	ARWEAVE_CURRENCY: "matic",
	ARWEAVE_WALLET:
		"e70c22ca3f3c257f35cc91e64e4e84847fc3f5ca6fe9d775a5254c8ea27a9d3e",
	INFURA_USERNAME: "username",
	INFURA_PASSWORD: "password",
};

nftToolbox.initCollection({
	name: "Demo Collection",
	dir: path.join(__dirname, "Demo Collection"),
	description: "This is a demo collection for NFT Toolbox",
});

const demoSingleNftImage = path.resolve(
	__dirname,
	"layers",
	"background",
	"grey.png"
);
const demoSingleNftMetadata = {
	name: "Demo Single NFT",
	description: "This is a single demo NFT",
	image: "",
	attributes: [
		{ trait_type: "color", value: "grey" },
		{ trait_type: "rarity", value: "1" },
	],
};

const uploadSingleExample = async function () {
	const res = await nftToolbox.uploadSingleNFT(
		demoSingleNftImage,
		demoSingleNftMetadata
	);
	console.log(res);
};

///////////////////////////////////////////////////////////////////////////////////

// nftToolbox.initFileStorageService({
// 	service: "pinata",
// 	key: accounts.PINATA_KEY,
// 	secret: accounts.PINATA_SECURITY,
// });

// nftToolbox.initFileStorageService({
// 	service: "nft.storage",
// 	key: accounts.NFT_STORAGE_KEY,
// });

// nftToolbox.initFileStorageService({
// 	service: "storj",
// 	username: accounts.STORJ_USERNAME,
// 	password: accounts.STORJ_PASSWORD,
// });

nftToolbox.initFileStorageService({
	service: "arweave",
	currency: accounts.ARWEAVE_CURRENCY,
	wallet: accounts.ARWEAVE_WALLET,
});

// nftToolbox.initFileStorageService({
// 	service: "infura",
// 	username: accounts.INFURA_USERNAME,
// 	password: accounts.INFURA_PASSWORD,
// });

///////////////////////////////////////////////////////////////////////////////////

// nftToolbox.uploadCollectionNFT();

uploadSingleExample();
