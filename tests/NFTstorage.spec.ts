import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import nock from "nock";
import path from "path";
import { NFTstorage } from "../src/classes/NFTstorage";
import { Collection } from "../src/classes/Collection";
import { readFileSync } from "fs";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");

const test_specs = JSON.parse(
	readFileSync(path.join(__dirname, "test_specs.json")).toString()
);
const TEST_NFT_STORAGE_KEY = test_specs.NFT_STORAGE_KEY;

const TEST_BUFFER_FOR_IMAGE = Buffer.from([8, 6, 7, 5, 3, 0, 9]);

const TEST_FAKE_DIR_STRUCTURE = {
	fake_dir: {
		"Demo Collection": {
			assets: {
				"1.png": TEST_BUFFER_FOR_IMAGE,
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
	it("Checking POST request in UploadDirToService", async function () {
		const scope = nock("https://api.nft.storage")
			.filteringPath(() => "/")
			.post("/")
			.reply(200, TEST_API_RESPONSE);

		await testNFTstorageObj.uploadDirToService(
			path.join(TEST_COL_PATH, "metadata")
		);

		expect(scope.isDone()).to.be.true;
	});

	it("Checking POST request in UploadFileToService", async function () {
		const scope = nock("https://api.nft.storage")
			.filteringPath(() => "/")
			.post("/")
			.reply(200, TEST_API_RESPONSE);

		await testNFTstorageObj.uploadFileToService(
			path.join(TEST_COL_PATH, "assets", "1.png")
		);

		expect(scope.isDone()).to.be.true;
	});

	it("Checking POST request in UploadJSONToService", async function () {
		const scope = nock("https://api.nft.storage")
			.filteringPath(() => "/")
			.post("/")
			.reply(200, TEST_API_RESPONSE);

		await testNFTstorageObj.uploadJSONToService(
			path.join(TEST_COL_PATH, "metadata", "1.json")
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
		const fake = sinon.fake.returns(
			new Promise<string>((resolve) => {
				const cid = TEST_API_RESPONSE.value.cid;
				resolve(cid);
			})
		);
		sinon.replace(testNFTstorageObj, "uploadDirToService", fake);

		await testNFTstorageObj.uploadCollection(testCol);

		expect(fake.calledTwice).to.be.true;
	});

	it("Checking Internal UploadFileToService Calls", async function () {
		const fakeFile = sinon.fake.returns(
			new Promise<string>((resolve) => {
				const cid = TEST_API_RESPONSE.value.cid;
				resolve(cid);
			})
		);
		const fakeJSON = sinon.fake.returns(
			new Promise<string>((resolve) => {
				const cid = TEST_API_RESPONSE.value.cid;
				resolve(cid);
			})
		);
		sinon.replace(testNFTstorageObj, "uploadFileToService", fakeFile);
		sinon.replace(testNFTstorageObj, "uploadJSONToService", fakeJSON);

		await testNFTstorageObj.uploadSingle(
			path.join(TEST_COL_PATH, "assets", "1.png"),
			JSON.parse(
				readFileSync(
					path.join(TEST_COL_PATH, "metadata", "1.json")
				).toString()
			)
		);

		expect(fakeFile.calledOnce).to.be.true;
		expect(fakeJSON.calledOnce).to.be.true;
	});
});
