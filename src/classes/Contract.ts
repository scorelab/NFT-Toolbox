import fs from "fs";
import { erc721, erc1155 } from "@openzeppelin/wizard";
import path from "path";

type ercStandards = "ERC721" | "ERC1155";

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
interface DraftOptions {
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
}
