# NFT-Toolbox

An npm package for seamless integration of all NFT related functionalities in Web2 projects.

## Supported Functionalities

1.  Generate NFT Collection Images and Metadata files from Layer Images
2.  Upload NFT Collection Assets and Metadata Files to IPFS (or alternative) Platforms via any of the following services:
    -   [NFT.storage](https://nft.storage/)
    -   [Pinata](https://www.pinata.cloud/)
    -   [Storj](https://landing.storj.io/permanently-pin-with-storj-dcs)
    -   [Infura](https://infura.io/product/ipfs)
    -   [Arweave](https://www.arweave.org/)
3.  Draft ERC721/ERC1155 Smart Contracts from scratch with [Open Zeppelin Wizard](https://github.com/OpenZeppelin/contracts-wizard)
4.  Deploy a Smart Contract to blockchain. Mainnets and Testnets of the following are supported are supported.
    -   [Ethereum](https://ethereum.org/): Mainnet, Ropsten, Rinkeby, Goerli, Kovan
    -   [Polygon](https://polygon.technology/): Mainnet, Mumbai
5.  Mint NFTs on a Smart Contract deployed on any of the supported networks.

## Project Workflows

![Project Workflows](/workflows.png)

## Folder structure

-   `/src` : Package source code
    -   `/src/index.ts ` : Toolbox class, the single default export from the package
    -   `/src/classes` : Core classes of the package that implement functionalities
    -   `/src/helpers` : Helper classes that are used by core classes
-   `/tests` : Tests for all core classes
-   `/examples` : Example scripts for all functionalities
-   `/docs` : Markdown documentation
-   `/documentation` : Docusaurus project for documentation website

## Contributor Guidelines

-   This project is an NPM package. All dependencies must be installed with `npm install`.
-   Dependencies for Upload functionality that are required based only in some cases based on user's specification are installed dynamically using [child-process](https://www.npmjs.com/package/child_process). They are included in dev-dependencies but not in dependencies. (For example @pinata/sdk).
-   Mocha, Chai and Sinon have been used for testing. Run all tests with `npm test`.
-   ESLint has been configured to lint for Typescript. Run linting with `npm run lint`.

## Development setup

1.  Fork the `scorelab/NFT-Toolbox` repository
    Follow these instructions on [how to fork a repository](https://help.github.com/en/articles/fork-a-repo)

2.  Clone the repository
    Navigate to the location on your computer where you want to host your code.
    Once in the appropriate folder, run the following command to clone the repository to your local machine.

    ```
    git clone https://github.com/{your-username}/NFT-Toolbox.git
    ```

3.  Install the dependencies, Setup the project with Node Package Manager.

    ```
    cd NFT-Toolbox
    npm install
    ```

4.  You are ready to go!

    To run an example script, update the required credentials in `examples/*.json` file and run

    ```
    ts-node examples/generate.ts
    ```

    To run Tests, update the required credentials in `tests/test_specs.json` file and run

    ```
    npm test
    ```

## Documentation

Documentation has been generated using [Docusaurus](https://docusaurus.io/).

The Docusaurus project is present in `documentation` directory. Install the dependencies

```
cd documentation
npm install
```

Run the development live server for Documentation

```
npm start
```
