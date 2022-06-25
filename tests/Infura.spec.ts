import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import nock from "nock";
import path from "path";
import { Infura } from "../src/classes/Infura";
import { Collection } from "../src/classes/Collection";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");
const TEST_INFURA_USERNAME = "username";
const TEST_INFURA_PASSWORD = "password";

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

const testInfuraObj = new Infura(TEST_INFURA_USERNAME, TEST_INFURA_PASSWORD);

describe("Test suite for Upload To Infura API", () => {
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
		const scope = nock("https://ipfs.infura.io:5001")
			.post("/api/v0/add")
			.reply(200, TEST_API_RESPONSE);

		await testInfuraObj.uploadDirToService(
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
		sinon.replace(testInfuraObj, "uploadDirToService", fake);

		await testInfuraObj.upload(testCol);

		expect(fake.calledTwice).to.be.true;
	});
});
