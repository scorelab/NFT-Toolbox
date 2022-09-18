import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import nock from "nock";
import path from "path";
import { Pinata } from "../src/classes/Pinata";
import { Collection } from "../src/classes/Collection";
import { readFileSync } from "fs";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");

const test_specs = JSON.parse(
	readFileSync(path.join(__dirname, "test_specs.json")).toString()
);
const TEST_PINATA_KEY = test_specs.PINATA_KEY;
const TEST_PINATA_SECURITY = test_specs.PINATA_SECURITY;

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
	id: "randomCID",
};

const testCol = new Collection({
	name: TEST_COL_NAME,
	dir: TEST_COL_PATH,
	description: "This is a demo collection for NFT Toolbox",
});

const testPinataObj = new Pinata(TEST_PINATA_KEY, TEST_PINATA_SECURITY);

describe("Test suite for Upload To Pinata API", () => {
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
		const scope = nock("https://api.pinata.cloud")
			.post("/pinning/pinFileToIPFS")
			.reply(200, TEST_API_RESPONSE);

		await testPinataObj.uploadDirToService(
			path.join(TEST_COL_PATH, "metadata")
		);

		expect(scope.isDone()).to.be.true;
	});

	it("Checking POST request in UploadFileToService", async function () {
		const scope = nock("https://api.pinata.cloud")
			.post("/pinning/pinFileToIPFS")
			.reply(200, TEST_API_RESPONSE);

		await testPinataObj.uploadFileToService(
			path.join(TEST_COL_PATH, "assets", "1.png")
		);

		expect(scope.isDone()).to.be.true;
	});

	it("Checking POST request in UploadJSONToService", async function () {
		const scope = nock("https://api.pinata.cloud")
			.post("/pinning/pinJSONToIPFS")
			.reply(200, TEST_API_RESPONSE);

		await testPinataObj.uploadJSONToService(
			readFileSync(
				path.join(TEST_COL_PATH, "metadata", "1.json")
			).toString()
		);

		expect(scope.isDone()).to.be.true;
	});
});

describe("Test suite for Upload Methods", () => {
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
				const cid = TEST_API_RESPONSE.id;
				resolve(cid);
			})
		);
		sinon.replace(testPinataObj, "uploadDirToService", fake);

		await testPinataObj.uploadCollection(testCol);

		expect(fake.calledTwice).to.be.true;
	});

	it("Checking Internal UploadFileToService Calls", async function () {
		const fakeFile = sinon.fake.returns(
			new Promise<string>((resolve) => {
				const cid = TEST_API_RESPONSE.id;
				resolve(cid);
			})
		);
		const fakeJSON = sinon.fake.returns(
			new Promise<string>((resolve) => {
				const cid = TEST_API_RESPONSE.id;
				resolve(cid);
			})
		);
		sinon.replace(testPinataObj, "uploadFileToService", fakeFile);
		sinon.replace(testPinataObj, "uploadJSONToService", fakeJSON);

		await testPinataObj.uploadSingle(
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
