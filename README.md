# NFT-Toolbox

An npm package for seamless integration of all NFT related functionalities in Web2 projects.

### Supported Functionalities

-   Generate NFT Collection Images and Metadata files from Layer Images
-   Upload NFT Collection Assets and Metadata Files to IPFS (or alternative) Platforms via any of the following services:
    1. [NFT.storage](https://nft.storage/)
    2. [Pinata](https://www.pinata.cloud/)
    3. [Storj](https://landing.storj.io/permanently-pin-with-storj-dcs)
    4. [Infura](https://infura.io/product/ipfs)
    5. [Arweave](https://www.arweave.org/)

### Development setup

1. Fork the `scorelab/NFT-Toolbox` repository
   Follow these instructions on [how to fork a repository](https://help.github.com/en/articles/fork-a-repo)

2. Clone the repository
   Navigate to the location on your computer where you want to host your code. Once in the appropriate folder, run the following command to clone the repository to your local machine.

```
git clone https://github.com/ {your-username} /NFT-Toolbox.git
```

3. Install the dependencies
   Setup the project with Node Package Manager.

```
cd NFT-Toolbox
npm install
```

4. You are ready to go!
   Run an example script

```
ts-node examples/generate.ts
```

Run Tests

```
npm test
```
