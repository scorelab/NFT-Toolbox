---
sidebar_position: 4
---

# Interact with Smart Contract

NFT Toolbox provides the functionality to interact with a deployed Smart Contract on a Blockchain Network.
This is done with `readContract` and `writeContract` functions.

Both the functions accept two parameters.

-   **(string)** The name of the Contract method to be called
-   **(array)** The parameters to be passed to the Contract method in order

`readContract` is used to call the _view_ methods on the Smart Contract which do not manipulate it's state.
It returns the response from the Smart Contract.

`writeContract` is used to call the methods on the Smart Contract which manipulate it's state.
It returns the [ethers.js](https://ethers.org/) transaction object created on the Contract.

## Example

**After [Deploying a Contract](/docs/Contracts/deploy) or [Initializing a Deployed Contract](/docs/Contracts/initializeContract#initialization-for-deployed-contract)**

```javascript
const exampleMintNFT = async () => {
	const address = "0xADDRESS";

	const tx = await nftToolbox.writeContract("safeMint", [address]);
	await tx.wait();

	const bal = await nftToolbox.readContract("balanceOf", [address]);
	console.log(bal.toString());
};

exampleMintNFT();
```
