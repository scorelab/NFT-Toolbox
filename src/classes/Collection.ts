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
	image: fs.PathLike;
	attributes: MetadataAttribute[];
}

export class Collection {
	name: string;
	dir: fs.PathLike;
	description: string = "";

	protected baseURL: string = "ipfs:/";
	protected extraMetadata: object = {};
	protected schema?: LayerSchema = undefined;
	protected layers?: Layer[] = undefined;

	constructor(attributes: CollectionAttributes) {
		this.name = attributes.name;
		this.description = attributes.description;
		this.dir = attributes.dir;
	}

	setBaseURL(url: string) {
		this.baseURL = url;
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
				str.split(".").shift()?.split(rarityDelimiter).shift();
			const rarityWeight = (str: string) =>
				str.split(".").shift()?.split(rarityDelimiter).pop();

			return fs
				.readdirSync(dir)
				.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
				.map((i, index) => {
					//Parsing File name
					if (i.includes(DNA_DELIMITER)) {
						throw new Error(
							`File name can not contain "${DNA_DELIMITER}", please fix: ${i}`
						);
					}
					let eleName = cleanName(i);
					if (!eleName) {
						throw new Error(`Error in loading File ${i}`);
					}
					let eleWeight = i.includes(schema.rarityDelimiter)
						? rarityWeight(i)
						: schema.rarityDefault;
					if (!eleWeight) {
						throw new Error(`Error in loading File ${i}`);
					}

					// Creating Element
					let element: LayerElement = {
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
			let dir = layerObj.dir
				? layerObj.dir
				: path.join(schema.dir.toString(), layerObj.name);
			let elements = getElements(dir, schema.rarityDelimiter);
			var totalWeight: number = 0;
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

	async generate() {
		// Making empty directory for generated NFTs
		if (!this.schema || !this.layers) {
			throw new Error("Schema required for generating NFTs");
		}
		if (fs.existsSync(this.dir)) {
			fs.rmSync(this.dir, { recursive: true });
		}
		fs.mkdirSync(this.dir);
		fs.mkdirSync(`${this.dir}/metadata`);
		fs.mkdirSync(`${this.dir}/assets`);

		// Helper Functions for generation
		// Creates a random DNA of element indexes based on rarity weights
		const createDna = (layers: Layer[]) => {
			let randomElementIds: number[] = [];
			layers.forEach((layer) => {
				let random = Math.random() * layer.totalWeight;
				for (var i = 0, sum = 0; i < layer.elements.length; i++) {
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
			let mappedDnaToLayers = _layers.map((layer, index) => {
				let selectedElement: LayerElement | undefined =
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

		const loadImage = async (element: LayerElement) => {
			try {
				return new Promise<canvas.Image>(async (resolve) => {
					const image = await canvas.loadImage(element.path);
					resolve(image);
				});
			} catch (error) {
				console.error(`Error loading image ${element.path}:`, error);
			}
		};

		const saveImage = (_index: number) => {
			fs.writeFileSync(
				`${this.dir}/assets/${_index}.png`,
				canvasInstance.toBuffer("image/png")
			);
		};

		// Returns metadata in OpenSea format to matadataList variable
		const getMetadata = (_index: number) => {
			let tempMetadata: Metadata = {
				name: `${this.name} #${_index}`,
				description: this.description,
				image: `${this.baseURL}/${_index}.png`,
				attributes: attributesList, // Dynamic list maintained in the Generation Loop
				...this.extraMetadata,
			};
			return tempMetadata;
		};

		const saveMetadata = (metadata: Metadata, _index: number) => {
			fs.writeFileSync(
				`${this.dir}/metadata/${_index}.json`,
				JSON.stringify(metadata, null, 2)
			);
		};

		const shuffle = (array: number[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		};

		// Initializations
		let indexCount: number = 1;
		let failedCount: number = 0;
		let abstractedIndexes: number[] = []; // Ordered array of indexes to be created

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

		var dnaList = new Set<string>(); //List of all DNAs created so far
		var attributesList: MetadataAttribute[] = []; //List of attributes added to an NFT, cleared in every iteration

		// Generation Loop
		while (indexCount <= this.schema.size) {
			// Creating new DNA
			let newDna = createDna(this.layers);

			// Creating NFT for DNA, if not done already
			if (isDnaUnique(dnaList, newDna)) {
				// Loading Elements
				let selectedElements: LayerElement[] = selectElements(
					newDna,
					this.layers
				);
				let loadedImages: Promise<canvas.Image | undefined>[] = [];
				selectedElements.forEach((element) => {
					loadedImages.push(loadImage(element));
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
					saveImage(abstractedIndexes[0]);
					let meta = getMetadata(abstractedIndexes[0]);
					saveMetadata(meta, abstractedIndexes[0]);
					//console.log(`Created index: ${abstractedIndexes[0]}, with DNA: ${newDna}`);
				});

				// Initializing for next iteration
				attributesList = [];
				dnaList.add(newDna);
				abstractedIndexes.shift();

				progressBar.update(indexCount);
				indexCount++;
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
}
