---
sidebar_position: 1
---

# Initialize Contract Object

Before jumping into any functionality, a Contract object has to be initialized in the Toolbox.
This is done with the `initContract` function.

## Parameters

The parameters of `initContract` function are described as follows.

| Name         | Type   | Description                                                                                                                                           |
| ------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | string | Name of the Contract used on deployment                                                                                                               |
| `symbol`     | string | Symbol of the Contract used on deployment                                                                                                             |
| `dir`        | string | Path to directory where the new Contract File is to be created                                                                                        |
| `standard`   | string | `"ERC721"` or `"ERC1155"`                                                                                                                             |
| `connection` | object | Used to set up **ethers.js** connection. Described [here](/docs/Contracts/initializeContract#connection-details)                                      |
| `deployed`   | object | _(optional)_ Used for initialization of deployed contracts. Described [here](/docs/Contracts/initializeContract#initialization-for-deployed-contract) |

### Connection Details

The fields of `connection` parameter are described as follows.

| Name       | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| `network`  | string | The Blockchain network on which contract is (to be) deployed |
| `provider` | object | Details of the JSON RPC provider to be used                  |
| `wallet`   | object | Contains `privateKey` of wallet to be used on the network    |

:::info
The contents of `connection` parameter in `initContract` function are used to set up an
[ethers.js](https://ethers.org/) connection.
See their [documentation](https://docs.ethers.io/v5/) for more details.
:::

#### Supported Networks

-   Ethereum Mainnet (`"homestead"`)
-   Ropsten Testnet (`"ropsten"`)
-   Rinkeby Testnet (`"rinkeby"`)
-   Goerli Testnet (`"goerli"`)
-   Kovan Testnet (`"kovan"`)
-   Polygon Mainnet (`"matic"`)
-   Polygon Mumbai Testnet (`"maticmum"`)

#### Supported Providers

-   [Etherscan](https://etherscan.io/apis)
-   [Infura](https://infura.io/register)
-   [Alchemy](https://dashboard.alchemyapi.io/signup?referral=55a35117-028e-4b7c-9e47-e275ad0acc6d)
-   [Pocket Gateway](https://pokt.network/pocket-gateway-ethereum-mainnet/)
-   [Ankr](https://www.ankr.com/protocol/public/)

:::note
See Supported Providers on ethers.js [here](https://docs.ethers.io/v5/api-keys/)
:::

### Initialization for Deployed Contract

A Contract object can be initialized from an alredy deployed contract as well by passing the optional parameter
`deployed` to `initContract` function.
The fields of `deployed` parameter are described as follows.

| Name      | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| `address` | string | Address of the deployed contract on network |
| `abi`     | object | ABI of the contract                         |

:::note
The initialization for deployed contracts will only be useful in the Interacting Functionality and not in
Draft or Deploy functionalities.
:::

## Example

**After [Importing the package](/docs/intro#import-it-in-your-project),**

```javascript
nftToolbox.initContract({
	name: "YourContract",
	symbol: "YOUR",
	dir: "./path/to/directory/Contracts/",
	standard: "ERC721",
	connection: {
		network: "homestead",
		provider: {
			infura: {
				projectId: "PROJECT_ID",
				projectSecret: "PROJECT_SECRET",
			},
		},
		wallet: { privateKey: "YOUR_PRIVATE_KEY" },
	},
	deployed: {
		address: "0xADDRESS",
		abi: JSON.parse(
			fs.readFileSync("./path/to/directory/Contracts/ContractAbi.json")
		),
	},
});
```
