import fs from "fs";
import path from "path";
import canvas from "canvas";
import { ProgressBar } from "../helpers/ProgressBar";

const DNA_DELIMITER = "+";

interface LayerInput {
	name: string;
	dir?: fs.PathLike;
}
export interface LayerSchema {
	dir: fs.PathLike;
	size: number;
	layersOrder: LayerInput[];
	format: {
		width: number;
		height: number;
		smoothing: boolean;
	};
	background: {
		generate: boolean;
		static?: boolean;
		default?: string;
		brightness?: number;
	};
	dnaCollisionTolerance: number;
	rarityDelimiter: string;
	rarityDefault: string;
	shuffleIndexes: boolean;
}
interface CollectionAttributes {
	name: string;
	dir: fs.PathLike;
	description: string;
}
interface LayerElement {
	id: number;
	name: string;
	filename: string;
	path: string;
	weight: number;
}
interface Layer {
	id: number;
	name: string;
	elements: LayerElement[];
	totalWeight: number;
}
interface MetadataAttribute {
	trait_type: string;
	value: string;
}
interface Metadata {
	name: string;
	description: string;
	image: string;
	attributes: MetadataAttribute[];
}

export class Collection {
	name: string;
	dir: fs.PathLike;
	description = "";

	baseURL = "";
	assetsDirCID = "";
	metadataDirCID = "";

	extraMetadata: object = {};
	schema?: LayerSchema = undefined;
	layers?: Layer[] = undefined;

	constructor(attributes: CollectionAttributes) {
		this.name = attributes.name;
		this.description = attributes.description;
		this.dir = attributes.dir;
	}

	// Functions to access file system
	initializeDir() {
		// Making empty directory for generated NFTs
		if (!this.schema || !this.layers) {
			throw new Error("Schema required for generating NFTs");
		}
		if (fs.existsSync(this.dir)) {
			fs.rmSync(this.dir, { recursive: true });
		}
		fs.mkdirSync(this.dir);
		fs.mkdirSync(path.join(this.dir.toString(), "assets"));
		fs.mkdirSync(path.join(this.dir.toString(), "metadata"));
	}
	readDirElements(dir: fs.PathLike) {
		return fs.readdirSync(dir);
	}
	async loadImage(element: LayerElement) {
		try {
			// eslint-disable-next-line no-async-promise-executor
			return new Promise<canvas.Image>(async (resolve) => {
				const image = await canvas.loadImage(element.path);
				resolve(image);
			});
		} catch (error) {
			console.error(`Error loading image ${element.path}:`, error);
		}
	}
	saveImage(_index: number, canvasInstance: canvas.Canvas) {
		fs.writeFileSync(
			path.join(this.dir.toString(), "assets", `${_index}.png`),
			canvasInstance.toBuffer("image/png")
		);
	}
	saveMetadata(metadata: Metadata, _index: number) {
		fs.writeFileSync(
			path.join(this.dir.toString(), "metadata", `${_index}.json`),
			JSON.stringify(metadata, null, 2)
		);
	}

	// Setters
	setBaseURL(url: string) {
		this.baseURL = url;
	}
	setAssetsDirCID(cid: string) {
		this.assetsDirCID = cid;
	}
	setMetadataDirCID(cid: string) {
		this.metadataDirCID = cid;
	}
	setExtraMetadata(data: object) {
		this.extraMetadata = data;
	}
	setSchema(schema: LayerSchema) {
		// Function to recursively read images in a Layer directory and return array of Elements
		const getElements = (dir: fs.PathLike, rarityDelimiter: string) => {
			// Functions for extracting name and rarity weight from file name
			// File name is of the form "{name} rarityDelimiter {rarityWeight} . {extension}"
			const cleanName = (str: string) =>
				path.parse(str).name.split(rarityDelimiter).shift();
			const rarityWeight = (str: string) =>
				path.parse(str).name.split(rarityDelimiter).pop();

			return this.readDirElements(dir)
				.filter((item) => !/(^|\/)\.[^/.]/g.test(item))
				.map((i, index) => {
					//Parsing File name
					if (i.includes(DNA_DELIMITER)) {
						throw new Error(
							`File name can not contain "${DNA_DELIMITER}", please fix: ${i}`
						);
					}
					const eleName = cleanName(i);
					if (!eleName) {
						throw new Error(`Error in loading File ${i}`);
					}
					const eleWeight = i.includes(schema.rarityDelimiter)
						? rarityWeight(i)
						: schema.rarityDefault;
					if (!eleWeight) {
						throw new Error(`Error in loading File ${i}`);
					}

					// Creating Element
					const element: LayerElement = {
						id: index,
						name: eleName,
						filename: i,
						path: path.join(dir.toString(), i),
						weight: parseInt(eleWeight),
					};
					return element;
				});
		};
		// Creating Layers array
		const layers: Layer[] = schema.layersOrder.map((layerObj, index) => {
			const dir = layerObj.dir
				? layerObj.dir
				: path.join(schema.dir.toString(), layerObj.name);
			const elements = getElements(dir, schema.rarityDelimiter);
			let totalWeight = 0;
			elements.forEach((element) => {
				totalWeight += element.weight;
			});
			return {
				id: index,
				name: layerObj.name,
				elements: elements,
				totalWeight: totalWeight,
			};
		});

		// Updating Collection attributes
		this.schema = schema;
		this.layers = layers;
	}

	// NFT Generate Method
	async generate() {
		if (!this.schema || !this.layers) {
			throw new Error("Schema required for generating NFTs");
		}

		// Helper Functions for generation
		// Creates a random DNA of element indexes based on rarity weights
		const createDna = (layers: Layer[]) => {
			const randomElementIds: number[] = [];
			layers.forEach((layer) => {
				const random = Math.random() * layer.totalWeight;
				for (let i = 0, sum = 0; i < layer.elements.length; i++) {
					sum += layer.elements[i].weight;
					if (sum >= random) {
						randomElementIds.push(layer.elements[i].id);
						break;
					}
				}
			});
			return randomElementIds.join(DNA_DELIMITER);
		};

		// Checks if DNA is already generated
		const isDnaUnique = (_dnaList: Set<string>, _dna: string) => {
			return !_dnaList.has(_dna);
		};

		// Selects elements for each layer based on DNA
		const selectElements = (_dna: string, _layers: Layer[]) => {
			const mappedDnaToLayers = _layers.map((layer, index) => {
				const selectedElement: LayerElement | undefined =
					layer.elements.find(
						(e) =>
							e.id.toString() == _dna.split(DNA_DELIMITER)[index]
					);
				if (selectedElement == undefined) {
					throw new Error("Something went wrong");
				}
				return selectedElement;
			});
			return mappedDnaToLayers;
		};

		// Returns metadata in OpenSea format to matadataList variable
		const getMetadata = (_index: number) => {
			const tempMetadata: Metadata = {
				name: `${this.name} #${_index}`,
				description: this.description,
				image: `${this.baseURL}/${this.assetsDirCID}/${_index}.png`,
				attributes: attributesList, // Dynamic list maintained in the Generation Loop
				...this.extraMetadata,
			};
			return tempMetadata;
		};

		// Shuffle integer array with Fisher-Yates Algorithm
		const shuffle = (array: number[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		};

		// Initializations
		this.initializeDir();

		let indexCount = 1;
		let failedCount = 0;
		const abstractedIndexes: number[] = []; // Ordered array of indexes to be created

		for (let i = 1; i <= this.schema.size; i++) {
			abstractedIndexes.push(i);
		}
		if (this.schema.shuffleIndexes) {
			shuffle(abstractedIndexes);
		}

		const progressBar = new ProgressBar(
			"Generating NFTs",
			this.schema.size
		);
		progressBar.init();

		const canvasInstance = canvas.createCanvas(
			this.schema.format.width,
			this.schema.format.height
		);
		const ctx = canvasInstance.getContext("2d");
		ctx.imageSmoothingEnabled = this.schema.format.smoothing;

		const dnaList = new Set<string>(); // List of all DNAs created so far
		let attributesList: MetadataAttribute[] = []; // List of attributes added to an NFT, cleared in every iteration

		// Generation Loop
		while (indexCount <= this.schema.size) {
			// Creating new DNA
			const newDna = createDna(this.layers);

			// Creating NFT for DNA, if not done already
			if (isDnaUnique(dnaList, newDna)) {
				// Loading Elements
				const selectedElements: LayerElement[] = selectElements(
					newDna,
					this.layers
				);
				const loadedImages: Promise<canvas.Image | undefined>[] = [];
				selectedElements.forEach((element) => {
					loadedImages.push(this.loadImage(element));
				});

				// Rendering Images
				await Promise.all(loadedImages).then((renderImageArray) => {
					if (!this.schema || !this.layers) {
						throw new Error("Schema not found");
					}

					// Clearing Canvas
					ctx.clearRect(
						0,
						0,
						this.schema.format.width,
						this.schema.format.height
					);
					// Adding Background, if specified
					if (this.schema.background.generate) {
						if (this.schema.background.static) {
							if (!this.schema.background.default) {
								throw new Error(
									"Default color is required for static background"
								);
							}
							ctx.fillStyle = this.schema.background.default;
						} else {
							ctx.fillStyle = `hsl(${Math.floor(
								Math.random() * 360
							)}, 100%, ${
								this.schema.background.brightness
									? this.schema.background.brightness
									: "50%"
							})`;
						}

						ctx.fillRect(
							0,
							0,
							this.schema.format.width,
							this.schema.format.height
						);
					}
					// Adding Layer Elements
					renderImageArray.forEach((img, index) => {
						if (!this.schema || !this.layers) {
							throw new Error("Schema not found");
						}
						ctx.drawImage(
							img,
							0,
							0,
							this.schema.format.width,
							this.schema.format.height
						);
						// Saving attribute for metadata
						attributesList.push({
							trait_type: this.layers[index].name,
							value: selectedElements[index].name,
						});
					});

					// Saving NFT image and Metadata
					this.saveImage(abstractedIndexes[0], canvasInstance);
					const meta = getMetadata(abstractedIndexes[0]);
					this.saveMetadata(meta, abstractedIndexes[0]);
				});

				// Initializing for next iteration
				progressBar.update(indexCount);
				indexCount++;
				attributesList = [];
				dnaList.add(newDna);
				abstractedIndexes.shift();
			} else {
				// DNA has already been generated
				failedCount++;
				if (failedCount >= this.schema.dnaCollisionTolerance) {
					throw new Error(
						`DNA Tolerance exceeded. More layers or elements are requierd to generate ${this.schema.size} images`
					);
				}
			}
		}
		// Generation Complete
		console.log(
			`\n${this.schema.size} NFTs generated for ${this.name} in ${this.dir}`
		);
	}

	updateMetadataWithCID() {
		const metadataDir = path.join(this.dir.toString(), "metadata");
		const files = fs.readdirSync(metadataDir);
		if ((files && files.length) <= 0) {
			console.log(
				`No Metadata files were found in folder '${metadataDir}'`
			);
			return;
		}

		files.forEach((fileName) => {
			const filePath = path.join(metadataDir, fileName);
			const file_content = fs.readFileSync(filePath);
			const content = JSON.parse(file_content.toString());
			content.image = `${this.baseURL}/${this.assetsDirCID}/${
				path.parse(fileName).name
			}.png`;
			fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
		});
	}
}
