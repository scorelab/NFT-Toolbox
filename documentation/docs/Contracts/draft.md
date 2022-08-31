---
sidebar_position: 2
---

# Draft Contract File

The **ERC721** and **ERC1155** standards created by [Open Zeppelin](https://www.openzeppelin.com/contracts)
are the most popular NFT Contracts used by the community.
The [Open Zeppelin Wizard](https://wizard.openzeppelin.com/) is a tool that programatically generates
Smart Contracts based on provided configurations.
NFT Toolbox provides the `draftContract` function that acts as an interface to Open Zeppelin Wizard.
Thus enabling users to generate Solidity Smart Contracts specifically to be used in their NFT projects.

## Parameters

:::info
The configurations listed below are directly passed to [Open Zeppelin Wizard](https://wizard.openzeppelin.com/).
See the platform to test the generated contract before using them in NFT Toolbox.
:::

The parameters of `initContract` function are described as follows.

| Name           | Type    | Standard Supported     | Description                                |
| -------------- | ------- | ---------------------- | ------------------------------------------ |
| `baseUri`      | string  | `ERC721` and `ERC1155` | Base URI used in deployment                |
| `burnable`     | boolean | `ERC721` and `ERC1155` | Allow Tokens to be Burned                  |
| `pausable`     | boolean | `ERC721` and `ERC1155` | Allow Transactions to be Paused            |
| `mintable`     | boolean | `ERC721` and `ERC1155` | Allow minting of new tokens                |
| `enumerable`   | boolean | `ERC721`               | Allow enumerating the tokens on chain      |
| `uriStorage`   | boolean | `ERC721`               | Include Storage based URI management       |
| `incremental`  | boolean | `ERC721`               | Assign incremental id to new Tokens        |
| `votes`        | boolean | `ERC721`               | Include support for voting and delegation  |
| `supply`       | boolean | `ERC1155`              | Track Total Supply                         |
| `updatableUri` | boolean | `ERC1155`              | Allow Privileged accounts to set a new URI |

## Examples

**After [Initializing the Contract Object](/docs/Contracts/initializeContract),**

Pass the required configurations to `draftContract` function to create a Solidity File.

-   **Standard: ERC271**

```javascript
nftToolbox.draftContract({
	baseUri: "ipfs://exampleCID/"
	// Common options
	burnable: false
	pausable: false
	mintable: false
	// ERC721 options
	enumerable: false
	uriStorage: false
	incremental: false
	votes: false
	// ERC1155 options
	supply: false;
	updatableUri: false;
});
```

-   **Standard: ERC1155**

```javascript
nftToolbox.draftContract({
	baseUri: "ipfs://exampleCID/"
	// Common options
	burnable: false
	pausable: false
	mintable: false
	// ERC721 options
	enumerable: false
	uriStorage: false
	incremental: false
	votes: false
	// ERC1155 options
	supply: false;
	updatableUri: false;
});
```
