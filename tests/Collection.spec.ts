import { describe } from "mocha";
import chai from "chai";
import sinon from "sinon";
import mock from "mock-fs";
import path from "path";
import canvas from "canvas";
import { Collection } from "../src/classes/Collection";

const expect = chai.expect;

const TEST_COL_NAME = "Test Collection";
const TEST_COL_PATH = path.join(process.cwd(), "fake_dir", "collection");
const TEST_SCHEMA_SIZE = 5;
const TEST_IMG = path.join(__dirname, "test.png");
const TEST_FAKE_DIR_STRUCTURE = {
	fake_dir: {
		layers: {
			layer1: {
				"l1e1.png": mock.load(TEST_IMG),
				"l1e2.png": mock.load(TEST_IMG),
			},
			layer2: {
				"l2e1#1.png": mock.load(TEST_IMG),
				"l2e2#2.png": mock.load(TEST_IMG),
			},
			layer3: {
				"l3e1.png": mock.load(TEST_IMG),
				"l3e2#5.png": mock.load(TEST_IMG),
			},
		},
		collection: {},
	},
};
const TEST_LAYER_NOS = Object.keys(
	TEST_FAKE_DIR_STRUCTURE.fake_dir.layers
).length;

const testSchema = {
	dir: path.join(process.cwd(), "fake_dir", "layers"),
	size: TEST_SCHEMA_SIZE,
	layersOrder: [{ name: "layer1" }, { name: "layer2" }, { name: "layer3" }],
	format: {
		width: 512,
		height: 512,
		smoothing: false,
	},
	background: {
		generate: false,
	},
	dnaCollisionTolerance: TEST_SCHEMA_SIZE * 10,
	rarityDelimiter: "#",
	rarityDefault: "1",
	shuffleIndexes: true,
};
const testColObj = new Collection({
	name: TEST_COL_NAME,
	dir: TEST_COL_PATH,
	description: "This is a Test Collection",
});

describe("Test suite for Schema Setter", () => {
	beforeEach(() => {
		mock(TEST_FAKE_DIR_STRUCTURE);
	});
	afterEach(() => {
		mock.restore();
	});
	it("Checking File System calls", () => {
		const spyReadDirElements = sinon.spy(testColObj, "readDirElements");
		testColObj.setSchema(testSchema);
		expect(spyReadDirElements.callCount).to.be.equal(TEST_LAYER_NOS);
		expect(spyReadDirElements.returnValues).to.have.lengthOf(
			TEST_LAYER_NOS
		);
	});
	it("Checking updated Schema attribute", () => {
		testColObj.setSchema(testSchema);
		expect(testColObj.schema).to.exist;
	});
	it("Checking updated Layers attribute", () => {
		testColObj.setSchema(testSchema);
		expect(testColObj.layers)
			.to.be.an("array")
			.that.has.lengthOf(
				Object.keys(TEST_FAKE_DIR_STRUCTURE.fake_dir.layers).length
			);
	});
});

describe("Test suite for Generate Method", () => {
	beforeEach(() => {
		mock(TEST_FAKE_DIR_STRUCTURE);
	});
	afterEach(() => {
		mock.restore();
	});
	it("Checking File System Calls", async function () {
		this.timeout(10000);
		const mockCol = sinon.mock(testColObj);
		const expInitializeDir = mockCol.expects("initializeDir");
		const expSaveImage = mockCol.expects("saveImage");
		const expSaveMetadata = mockCol.expects("saveMetadata");
		expInitializeDir.exactly(1);
		expSaveImage.exactly(TEST_SCHEMA_SIZE);
		expSaveMetadata.exactly(TEST_SCHEMA_SIZE);

		const fakeLoadImage = sinon.fake.returns(
			// eslint-disable-next-line no-async-promise-executor
			new Promise<canvas.Image>(async (resolve) => {
				const image = await canvas.loadImage(TEST_IMG);
				resolve(image);
			})
		);
		sinon.replace(testColObj, "loadImage", fakeLoadImage);

		await testColObj.generate();

		mockCol.verify();
	});
});
