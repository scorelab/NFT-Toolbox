---
sidebar_position: 3
---

# Upload an NFT Collection

In addition to Single NFTs, NFT Toolbox also provides the functionality to upload entire
NFT collections to chosen File Storage Platform.

In order to be uploaded, a Collection has to first be initialized in the Toolbox. Here is how to
[Initialize a Collection](/docs/generate#initialize-a-collection).

:::note
The structure of directory provided to `initCollection` as parameter `dir` is restricted.
It must contain two directories named `assets` and `metadata`. These are the directories that NFT Toolbox
will upload to File Storage. The names of Asset and corresponding Metadata files must be same.
:::

NFT Collections are uploaded to File Storage with the `uploadCollection` function in Toolbox. The
`uploadCollection` function first uploads the `assets` directory to File Storage. Then each metadata file
in the `metadata` folder is updated with the corresponding asset's URL.
Finally the `metadata` directory is uploaded to File Storage and both Asset and Metadata
[CIDs](https://docs.ipfs.tech/concepts/content-addressing/) are returned.

:::note
The `image` field in Metadata is named and updated in accordance with the
[OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards).
If a different format is required, it can be updated separately using the
[CIDs](https://docs.ipfs.tech/concepts/content-addressing/) returned by the function.
:::

## Example

**After [Initializing a Collection](/docs/generate#initialize-a-collection) and [Initializing the File Storage](/docs/Upload/initializeFileStorage),**

```javascript
const uploadCollectionExample = async function () {
	const { assetCID, metadataCID } = await nftToolbox.uploadCollectionNFT();
	console.log(assetCID, metadataCID);
};
uploadCollectionExample();
```
