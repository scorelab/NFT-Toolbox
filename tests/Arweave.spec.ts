import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import nock from "nock";
import path from "path";
import { Arweave } from "../src/classes/Arweave";
import { Collection } from "../src/classes/Collection";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");
const TEST_ARWEAVE_WALLET = {
	kty: "",
	n: "",
	e: "",
	d: "",
	p: "",
	q: "",
	dp: "",
	dq: "",
	qi: "",
};

const TEST_FAKE_DIR_STRUCTURE = {
	fake_dir: {
		"Demo Collection": {
			assets: {
				"1.png": "",
				"2.png": "",
			},
			metadata: {
				"1.json": "{}",
				"2.json": "{}",
			},
		},
	},
};
const TEST_API_RESPONSE = {
	Hash: "randomCID",
};

const testCol = new Collection({
	name: TEST_COL_NAME,
	dir: TEST_COL_PATH,
	description: "This is a demo collection for NFT Toolbox",
});

const testArweaveObj = new Arweave(TEST_ARWEAVE_WALLET);

describe.skip("Test suite for Upload To Arweave API", () => {
	beforeEach(() => {
		mock(TEST_FAKE_DIR_STRUCTURE, {
			createCwd: true,
			createTmp: true,
		});
	});
	afterEach(() => {
		mock.restore();
		nock.cleanAll();
	});
	it("Checking POST request", async function () {
		const scope = nock("http://node1.bundlr.network")
			.filteringPath((path) => "/")
			.post("/")
			.reply(200, TEST_API_RESPONSE);

		// mock-fs does not support fs.opendir()
		// Reference: https://github.com/tschaub/mock-fs/issues/319
		// Bundlr upload method utilizes fs.opendir internally and is throwing while testing
		// "Error: ENOENT: no such file or directory, opendir 'C:\Users\sadas\Desktop\NFT-Toolbox\fake_dir\Demo Collection\metadata'"
		// Skipping this Test Suite

		await testArweaveObj.uploadDirToService(
			path.join(TEST_COL_PATH, "metadata")
		);

		expect(scope.isDone()).to.be.true;
	});
});

describe("Test suite for Upload Method", () => {
	beforeEach(() => {
		mock(TEST_FAKE_DIR_STRUCTURE, {
			createCwd: true,
			createTmp: true,
		});
	});
	afterEach(() => {
		mock.restore();
	});
	it("Checking Internal UploadDirToService Calls", async function () {
		var fake = sinon.fake.returns(
			new Promise<string>(async (resolve) => {
				const cid = TEST_API_RESPONSE.Hash;
				resolve(cid);
			})
		);
		sinon.replace(testArweaveObj, "uploadDirToService", fake);

		await testArweaveObj.upload(testCol);

		expect(fake.calledTwice).to.be.true;
	});
});
