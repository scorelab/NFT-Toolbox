import path from "path";
import { nftToolbox } from "../src/index";

const accounts = {
	PINATA_KEY: "PINATA_KEY",
	PINATA_SECURITY: "PINATA_SECURITY",
	NFT_STORAGE_KEY: "NFT_STORAGE_KEY",
	STORJ_USERNAME: "username",
	STORJ_PASSWORD: "password",
	ARWEAVE_CURRENCY: "currency",
	ARWEAVE_WALLET: "private_key",
	INFURA_USERNAME: "username",
	INFURA_PASSWORD: "password",
};

nftToolbox.initCollection({
	name: "Demo Collection",
	dir: path.join(__dirname, "Demo Collection"),
	description: "This is a demo collection for NFT Toolbox",
});

const uploadCollectionExample = async function () {
	const { assetCID, metadataCID } = await nftToolbox.uploadCollectionNFT();
	console.log(assetCID, metadataCID);
};

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

// nftToolbox.initFileStorageService({
// 	service: "arweave",
// 	currency: accounts.ARWEAVE_CURRENCY,
// 	wallet: accounts.ARWEAVE_WALLET,
// });

// nftToolbox.initFileStorageService({
// 	service: "infura",
// 	username: accounts.INFURA_USERNAME,
// 	password: accounts.INFURA_PASSWORD,
// });

///////////////////////////////////////////////////////////////////////////////////

uploadCollectionExample();

uploadSingleExample();
