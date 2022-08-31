---
sidebar_position: 1
---

# Initialize File Storage

The first step in this functionality is to initialize the Toolbox with a File Storage Platform.

In order to incorporate as many user requirements as possible and not impose any choice on them,
NFT Toolbox has support for multiple File Storage Platforms.

## Supported Platforms

The platforms currently supported are as follows:

-   [NFT.storage](https://nft.storage/) (IPFS)
-   [Pinata](https://www.pinata.cloud/) (IPFS)
-   [Storj](https://www.storj.io/ipfs) (IPFS)
-   [Infura](https://infura.io/product/ipfs) (IPFS)
-   [Arweave](https://www.arweave.org/)

Users can choose any of the above platforms according to their requirements.

## Parameters

Initialization is done with the `initFileStorage` function.
`initFileStorage` function takes a string parameter for selecting the File Storage Platform and
the user's credentials for the Platform.

The Platforms and Credentials are as follows.

| Platform    | Parameter | Type             | Description                           |
| ----------- | --------- | ---------------- | ------------------------------------- |
| NFT.Storage | service   | string           | `nft.storage`                         |
|             | key       | string           | API Key for NFT.Storage Account       |
| Pinata      | service   | string           | `pinata`                              |
|             | key       | string           | API Key for Pinata Account            |
|             | secret    | string           | API Key Secret                        |
| Storj       | service   | string           | `storj`                               |
|             | username  | string           | Username for Storj IPFS Account       |
|             | password  | string           | Password for Storj IPFS Account       |
| Infura      | service   | string           | `infura`                              |
|             | username  | string           | Username for Infura IPFS Project      |
|             | password  | string           | Password for Infura IPFS Project      |
| Arweave     | service   | string           | `arweave`                             |
|             | currency  | string           | Currency used for Bundlr Transactions |
|             | wallet    | string or object | Private Key or JSON Wallet            |

:::note
NFT Toolbox uses [Bundlr](https://bundlr.network/) to upload files to Arweave. See the [Supported currencies for Bundlr](https://docs.bundlr.network/docs/currencies).
:::

## Examples

Examples of initializing File Storage are as follows.

**After [Importing the package](/docs/intro#import-it-in-your-project),**

-   NFT.Storage

```javascript
nftToolbox.initFileStorageService({
	service: "nft.storage",
	key: "NFT_STORAGE_KEY",
});
```

-   Pinata

```javascript
nftToolbox.initFileStorageService({
	service: "pinata",
	key: "PINATA_KEY",
	secret: "PINATA_SECURITY",
});
```

-   Storj

```javascript
nftToolbox.initFileStorageService({
	service: "storj",
	username: "STORJ_USERNAME",
	password: "STORJ_PASSWORD",
});
```

-   Infura

```javascript
nftToolbox.initFileStorageService({
	service: "infura",
	username: "INFURA_USERNAME",
	password: "INFURA_PASSWORD",
});
```

-   Arweave

```javascript
nftToolbox.initFileStorageService({
	service: "arweave",
	currency: "arweave",
	wallet: JSON.parse(readFileSync("ARWEAVE_WALLET.json").toString()),
});
```
