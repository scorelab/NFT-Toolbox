import fs from "fs";
import { erc721, erc1155 } from "@openzeppelin/wizard";
import path from "path";
import { ethers } from "ethers";
const solc = require("solc");

type ercStandards = "ERC721" | "ERC1155";
type networks =
	| "homestead"
	| "ropsten"
	| "rinkeby"
	| "goerli"
	| "kovan"
	| "matic"
	| "maticmum";

/*
interface ERC721Options {
	name: string;
    symbol: string;
    baseUri?: string;
    enumerable?: boolean;
    uriStorage?: boolean;
    burnable?: boolean;
    pausable?: boolean;
    mintable?: boolean;
    incremental?: boolean;
    votes?: boolean;
}

interface ERC1155Options {
	name: string;
    uri: string;
    burnable?: boolean;
    pausable?: boolean;
    mintable?: boolean;
    supply?: boolean;
    updatableUri?: boolean;
}
*/
export interface DraftOptions {
	baseUri: string;
	// Common options
	burnable?: boolean;
	pausable?: boolean;
	mintable?: boolean;
	// ERC721 options
	enumerable?: boolean;
	uriStorage?: boolean;
	incremental?: boolean;
	votes?: boolean;
	// ERC1155 options
	supply?: boolean;
	updatableUri?: boolean;
}

export interface DeployConfigs {
	network: networks;
	provider: {
		etherscan?: string;
		alchemy?: string;
		ankr?: string;
		infura?: {
			projectId: string;
			projectSecret: string;
		};
		pocket?: {
			applicationId: string;
			applicationSecretKey: string;
		};
	};
	wallet: {
		privateKey: string;
	};
}

export interface ContractAttributes {
	dir: fs.PathLike;
	standard: ercStandards;
	name: string;
	symbol: string;
}

export class Contract {
	dir: fs.PathLike;
	standard: ercStandards;

	name: string;
	symbol: string;

	signer: ethers.Signer | undefined = undefined;
	provider: ethers.providers.Provider | undefined = undefined;
	deployedInstance: ethers.Contract | undefined = undefined;

	constructor(attr: ContractAttributes) {
		this.dir = attr.dir;
		this.standard = attr.standard;
		this.name = attr.name;
		this.symbol = attr.symbol;
	}

	write(contractCode: string) {
		if (!fs.existsSync(this.dir)) {
			fs.mkdirSync(this.dir);
		}
		fs.writeFileSync(
			path.join(this.dir.toString(), `${this.name}.sol`),
			contractCode,
			{ flag: "w" }
		);
	}

	draft(options: DraftOptions) {
		let contractCode: string;
		switch (this.standard) {
			case "ERC721":
				contractCode = erc721.print({
					name: this.name,
					symbol: this.symbol,
					...options,
				});
				break;
			case "ERC1155":
				contractCode = erc1155.print({
					name: this.name,
					uri: options.baseUri,
					...options,
				});
				break;
		}
		this.write(contractCode);
		console.log(`Contract created : ${this.dir}`);
	}

	compile() {
		function findImports(importPath: string) {
			if (importPath.startsWith("@openzeppelin"))
				return {
					contents: fs
						.readFileSync(
							path.join(process.cwd(), "node_modules", importPath)
						)
						.toString(),
				};
			else {
				return { error: "OPEN ZEPPELIN IMPORT FAILED" };
			}
		}

		const compilerInput = {
			language: "Solidity",
			sources: {
				Contract: {
					content: fs
						.readFileSync(
							path.join(this.dir.toString(), `${this.name}.sol`)
						)
						.toString(),
				},
			},
			settings: {
				outputSelection: {
					"*": {
						"*": ["*"],
					},
				},
			},
		};

		console.log(`Compiling ${this.name}.sol`);
		const compilerOutput = JSON.parse(
			solc.compile(JSON.stringify(compilerInput), { import: findImports })
		);
		// if (!compilerOutput.errors) {
		// 	console.log("Compilation Successful");
		// } else {
		// 	console.log("Compilation Not Successful");
		// }
		return compilerOutput;
	}

	async deploy(config: DeployConfigs) {
		const network = ethers.providers.getNetwork(config.network);
		if (Object.keys(config.provider).length != 1) {
			throw new Error(
				`Exactly One Provider is expected, found ${
					Object.keys(config.provider).length
				}`
			);
		}
		switch (Object.keys(config.provider)[0]) {
			case "etherscan":
				this.provider = new ethers.providers.EtherscanProvider(
					network,
					config.provider.etherscan
				);
			case "alchemy":
				this.provider = new ethers.providers.AlchemyProvider(
					network,
					config.provider.alchemy
				);
			case "ankr":
				this.provider = new ethers.providers.AnkrProvider(
					network,
					config.provider.ankr
				);
			case "infura":
				this.provider = new ethers.providers.InfuraProvider(
					network,
					config.provider.infura
				);
			case "pocket":
				this.provider = new ethers.providers.PocketProvider(
					network,
					config.provider.pocket
				);
		}

		this.signer = new ethers.Wallet(
			config.wallet.privateKey,
			this.provider
		);

		const cntFactory = ethers.ContractFactory.fromSolidity(
			this.compile().contracts.Contract[this.name],
			this.signer
		);
		console.log(`Deploying ${this.name}.sol`);
		const contract = await cntFactory.deploy();
		const receipt = await contract.deployTransaction.wait();
		console.log(`Contract Address : ${contract.address}`);
		this.deployedInstance = contract;
	}
}
