import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import nock from "nock";
import path from "path";
import { NFTstorage } from "../src/classes/NFTstorage";
import { Collection } from "../src/classes/Collection";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");
const TEST_NFT_STORAGE_KEY = "c035310605551a107fb5";

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
	IpfsHash: "randomCID",
	value: {
		cid: "randomCID",
	},
	ok: true,
};

const testCol = new Collection({
	name: TEST_COL_NAME,
	dir: TEST_COL_PATH,
	description: "This is a demo collection for NFT Toolbox",
});

const testNFTstorageObj = new NFTstorage(TEST_NFT_STORAGE_KEY);

describe("Test suite for Upload To NFTstorage API", () => {
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
		const scope = nock("https://api.nft.storage")
			.filteringPath((path) => "/")
			.post("/")
			.reply(200, TEST_API_RESPONSE);

		await testNFTstorageObj.uploadDirToService(
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
				const cid = TEST_API_RESPONSE.IpfsHash;
				resolve(cid);
			})
		);
		sinon.replace(testNFTstorageObj, "uploadDirToService", fake);

		await testNFTstorageObj.upload(testCol);

		expect(fake.calledTwice).to.be.true;
	});
});
