import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import nock from "nock";
import path from "path";
import { Pinata } from "../src/classes/Pinata";
import { Collection } from "../src/classes/Collection";

const expect = chai.expect;

const TEST_COL_NAME = "Demo Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "Demo Collection");
const TEST_PINATA_KEY = "c035310605551a107fb5";
const TEST_PINATA_SECURITY =
	"23bfd7200d9c4376738ee232bfc06baf533b2d53c75f524f6461d7f7d8fa25b6";

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
	it("Checking POST request", async function () {
		const scope = nock("https://api.pinata.cloud")
			.post("/pinning/pinFileToIPFS")
			.reply(200, TEST_API_RESPONSE);

		await testPinataObj.uploadDirToService(
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
		sinon.replace(testPinataObj, "uploadDirToService", fake);

		await testPinataObj.upload(testCol);

		expect(fake.calledTwice).to.be.true;
	});
});
