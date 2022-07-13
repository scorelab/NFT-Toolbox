import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import fs from "fs";
import path from "path";
import { Contract } from "../src/classes/Contract";

const expect = chai.expect;

const TEST_CONT_NAME = "DemoNFT";
const TEST_CONT_PATH = path.join(process.cwd(), "fake_dir", "Contracts");

const TEST_FAKE_DIR_STRUCTURE = {
	fake_dir: {
		Contracts: {},
	},
};

const testCont = new Contract({
	name: TEST_CONT_NAME,
	symbol: TEST_CONT_NAME,
	dir: TEST_CONT_PATH,
	standard: "ERC721",
});

describe("Test suite for Contract Class", () => {
	beforeEach(() => {
		mock(TEST_FAKE_DIR_STRUCTURE, {
			createCwd: true,
			createTmp: true,
		});
	});
	afterEach(() => {
		mock.restore();
	});
	it("Checking Draft Method", async function () {
		testCont.draft({
			baseUri: "ipfs://",
		});
		expect(
			fs.existsSync(path.join(TEST_CONT_PATH, `${TEST_CONT_NAME}.sol`))
		).to.be.true;
	});
	it("Checking Deploy Method", async function () {
		testCont.draft({
			baseUri: "ipfs://",
		});
		testCont.deploy({
			network: "rinkeby",
			provider: {
				infura: {
					projectId: "ad8d113a8af144169f7941c14b1a4578",
					projectSecret: "eaf0b3b238934df58354d6cfabea489c",
				},
			},
			wallet: {
				privateKey:
					"e70c22ca3f3c257f35cc91e64e4e84847fc3f5ca6fe9d775a5254c8ea27a9d3e",
			},
		});
	});
});
