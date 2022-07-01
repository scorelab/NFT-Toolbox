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
});
