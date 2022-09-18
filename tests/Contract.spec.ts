import { describe } from "mocha";
import chai from "chai";
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

const test_specs = JSON.parse(
	fs.readFileSync(path.join(__dirname, "test_specs.json")).toString()
);

const testCont = new Contract({
	name: TEST_CONT_NAME,
	symbol: TEST_CONT_NAME,
	dir: TEST_CONT_PATH,
	standard: "ERC721",
	connection: test_specs.connection,
	deployed: {
		address: test_specs.connection,
		abi: JSON.stringify(test_specs.abi),
	},
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
	it("Checking Draft Method", () => {
		testCont.draft({
			baseUri: "ipfs://",
		});
		expect(
			fs.existsSync(path.join(TEST_CONT_PATH, `${TEST_CONT_NAME}.sol`))
		).to.be.true;
	});
});
