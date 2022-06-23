import path from "path";
import { nftToolbox } from "../src/index";

const accounts = {
	PINATA_KEY: "c035310605551a107fb5",
	PINATA_SECURITY:
		"23bfd7200d9c4376738ee232bfc06baf533b2d53c75f524f6461d7f7d8fa25b6",
	NFT_STORAGE_KEY:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGIwNzFBZTU0Q0RFNmQ2MDZBNDU2N0Y2QzE2NzQ3NDNBN2E4NzdlQjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NTkyMTY1Mzg5OCwibmFtZSI6Ik5GVCBUb29sYm94IERlbW8ifQ.sKGyyKdhvsfFhB399DNrHJtJcS5vLeAvWnAdAziuc3I",
};

nftToolbox.initCollection({
	name: "Demo Collection",
	dir: path.join(__dirname, "Demo Collection"),
	description: "This is a demo collection for NFT Toolbox",
});

// nftToolbox.initIPFSService({
// 	service: "pinata",
// 	key: accounts.PINATA_KEY,
// 	secret: accounts.PINATA_SECURITY,
// });

nftToolbox.initIPFSService({
	service: "nft.storage",
	key: accounts.NFT_STORAGE_KEY,
});

nftToolbox.uploadNFTs();
