import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import nock from "nock";
import path from "path";
import { Infura } from "../src/classes/Infura";
import { Collection } from "../src/classes/Collection";
import { readFileSync } from "fs";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");

const test_specs = JSON.parse(
	readFileSync(path.join(__dirname, "test_specs.json")).toString()
);
const TEST_INFURA_USERNAME = test_specs.INFURA_USERNAME;
const TEST_INFURA_PASSWORD = test_specs.INFURA_PASSWORD;

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
const TEST_API_RESPONSES = [
	{
		Hash: "randomCID",
		Name: TEST_COL_PATH.toString().split("\\").join("/"),
	},
	{
		Hash: "randomCID",
		Name: path
			.join(TEST_COL_PATH, "metadata")
			.toString()
			.split("\\")
			.join("/"),
	},
	{
		Hash: "randomCID",
		Name: path
			.join(TEST_COL_PATH, "metadata", "1.json")
			.toString()
			.split("\\")
			.join("/"),
	},
];

const TEST_API_RESPONSE = {
	ndjsonRes: TEST_API_RESPONSES.map((obj) => JSON.stringify(obj)).join("\n"),
	jsonRes: TEST_API_RESPONSES[0],
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
	it("Checking POST request in uploadDirToService", async function () {
		const scope = nock("https://ipfs.infura.io:5001")
			.post("/api/v0/add")
			.reply(200, TEST_API_RESPONSE.ndjsonRes);

		await testInfuraObj.uploadDirToService(
			path.join(TEST_COL_PATH, "metadata")
		);

		expect(scope.isDone()).to.be.true;
	});

	it("Checking POST request in uploadFileToService", async function () {
		const scope = nock("https://ipfs.infura.io:5001")
			.post("/api/v0/add")
			.reply(200, TEST_API_RESPONSE.jsonRes);

		await testInfuraObj.uploadFileToService(
			path.join(TEST_COL_PATH, "assets", "1.png")
		);

		expect(scope.isDone()).to.be.true;
	});

	it("Checking POST request in uploadJSONToService", async function () {
		const scope = nock("https://ipfs.infura.io:5001")
			.post("/api/v0/add")
			.reply(200, TEST_API_RESPONSE.jsonRes);

		await testInfuraObj.uploadJSONToService(
			readFileSync(
				path.join(TEST_COL_PATH, "metadata", "1.json")
			).toString()
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
				const cid = TEST_API_RESPONSE.Hash;
				resolve(cid);
			})
		);
		sinon.replace(testInfuraObj, "uploadDirToService", fake);

		await testInfuraObj.uploadCollection(testCol);

		expect(fake.calledTwice).to.be.true;
	});

	it("Checking Internal UploadFileToService and UploadJSONToService Calls", async function () {
		const fakeFile = sinon.fake.returns(
			new Promise<string>((resolve) => {
				const cid = TEST_API_RESPONSE.Hash;
				resolve(cid);
			})
		);
		const fakeJSON = sinon.fake.returns(
			new Promise<string>((resolve) => {
				const cid = TEST_API_RESPONSE.Hash;
				resolve(cid);
			})
		);
		sinon.replace(testInfuraObj, "uploadFileToService", fakeFile);
		sinon.replace(testInfuraObj, "uploadJSONToService", fakeJSON);

		await testInfuraObj.uploadSingle(
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
