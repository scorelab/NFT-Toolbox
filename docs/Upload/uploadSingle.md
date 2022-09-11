---
sidebar_position: 2
---

# Upload a Single NFT

An NFT is represented by a digital asset and its metadata. NFT Toolbox provides the functionality to
upload a single NFT to the chosen File Storage Platform.

This is done with the `uploadSingleNFT` function. It takes the Path to an Asset File and a Metadata Object
as parameters. First the Asset file is uploaded. The Uploaded Asset's URL is updated in the Metadata's `image`
field. Finally the updated Metadata is uploaded and both Asset and Metadata
[CIDs](https://docs.ipfs.tech/concepts/content-addressing/) are returned.

:::note
The `image` field in Metadata is named and updated in accordance with the
[OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards).
If a different format is required, it can be updated separately using the
[CIDs](https://docs.ipfs.tech/concepts/content-addressing/) returned by the function.
:::

## Example

**After [Initializing the File Storage](/docs/Upload/initializeFileStorage),**

```javascript
const nftImagePath = "./path/to/YourAsset.png";
const nftMetadata = {
	name: "Your Single NFT",
	description: "This is a single NFT",
};

const uploadSingleExample = async function () {
	const { assetCID, metadataCID } = await nftToolbox.uploadSingleNFT(
		nftImagePath,
		nftMetadata
	);
	console.log(assetCID, metadataCID);
};
uploadSingleExample();
```
