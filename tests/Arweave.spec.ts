import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import path from "path";
import { Arweave } from "../src/classes/Arweave";
import { Collection } from "../src/classes/Collection";
import { createReadStream, readFileSync } from "fs";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");

const test_specs = JSON.parse(
	readFileSync(path.join(__dirname, "test_specs.json")).toString()
);
const TEST_ARWEAVE_CURRENCY = test_specs.ARWEAVE_CURRENCY;
const TEST_ARWEAVE_WALLET = test_specs.ARWEAVE_WALLET;

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
	data: { id: "randomCID" },
};

const testCol = new Collection({
	name: TEST_COL_NAME,
	dir: TEST_COL_PATH,
	description: "This is a demo collection for NFT Toolbox",
});

const testArweaveObj = new Arweave(TEST_ARWEAVE_CURRENCY, TEST_ARWEAVE_WALLET);

describe("Test suite for Upload with Bundlr SDK", () => {
	beforeEach(() => {
		mock(TEST_FAKE_DIR_STRUCTURE, {
			createCwd: true,
			createTmp: true,
		});
		const fakeFund = sinon.fake.resolves(null);
		sinon.replace(testArweaveObj, "fundBundlr", fakeFund);
	});
	afterEach(() => {
		mock.restore();
		sinon.restore();
	});
	it("Checking SDK function call in uploadDirToService", async function () {
		const fake = sinon.fake.resolves(TEST_API_RESPONSE.data.id);
		sinon.replace(testArweaveObj.CONNECTION.uploader, "uploadFolder", fake);

		await testArweaveObj.uploadDirToService(
			path.join(TEST_COL_PATH, "metadata")
		);

		expect(
			fake.calledOnceWith(path.join(TEST_COL_PATH, "metadata").toString())
		).to.be.true;
	});
	it.skip("Checking SDK function call in uploadFileToService", async function () {
		const fake = sinon.fake.resolves(TEST_API_RESPONSE);
		sinon.replace(
			testArweaveObj.CONNECTION.uploader.chunkedUploader,
			"uploadData",
			fake
		);

		await testArweaveObj.uploadFileToService(
			path.join(TEST_COL_PATH, "assets", "1.png")
		);

		expect(
			fake.calledOnceWith(
				createReadStream(path.join(TEST_COL_PATH, "assets", "1.png"))
			)
		).to.be.true;
	});
	it.skip("Checking SDK function call in uploadJSONToService", async function () {
		const fake = sinon.fake.resolves(TEST_API_RESPONSE);
		sinon.replace(
			testArweaveObj.CONNECTION.uploader.chunkedUploader,
			"uploadData",
			fake
		);

		await testArweaveObj.uploadJSONToService(
			readFileSync(
				path.join(TEST_COL_PATH, "metadata", "1.json")
			).toString()
		);

		expect(
			fake.calledOnceWith(
				Buffer.from(
					readFileSync(
						path.join(TEST_COL_PATH, "metadata", "1.json")
					).toString()
				)
			)
		).to.be.true;
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
		const fake = sinon.fake.resolves(TEST_API_RESPONSE.data.id);
		sinon.replace(testArweaveObj, "uploadDirToService", fake);

		await testArweaveObj.uploadCollection(testCol);

		expect(fake.calledTwice).to.be.true;
	});
	it("Checking Internal UploadFileToService and UploadJSONToService Calls", async function () {
		const fakeFile = sinon.fake.resolves(TEST_API_RESPONSE.data.id);
		const fakeJSON = sinon.fake.resolves(TEST_API_RESPONSE.data.id);
		sinon.replace(testArweaveObj, "uploadFileToService", fakeFile);
		sinon.replace(testArweaveObj, "uploadJSONToService", fakeJSON);

		await testArweaveObj.uploadSingle(
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
