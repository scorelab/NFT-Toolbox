---
sidebar_position: 3
---

# Deploy Smart Contract

Once a Contract File has been finalized, it needs to be deployed to a blockchain network to make it operational.
NFT Toolbox makes this very simple with the `deployContract` function.

The function uses the parameters provided to initialize Contract object to locate the Contract File,
establish an [ethers.js](https://ethers.org/) connection to the Blockchain network, Deploy the contract
and initialize it.

**After [Initializing the Contract Object](/docs/Contracts/initializeContract),**

```javascript
nftToolbox.deployContract();
```

:::note
The directory path provided as parameter `dir` to `initContract` function must contain a Solidity file
with file name same as the parameter `name` passed to `initContract` function. This is the Contract file
that will be deployed by NFT Toolbox.
:::
