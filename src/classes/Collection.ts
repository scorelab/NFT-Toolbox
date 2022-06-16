import fs = require("fs");
import path = require("path");
import canvas = require("canvas");

interface LayerInput{
    name:string;
    dir?:fs.PathLike;
}
export interface LayerSchema{
    dir:fs.PathLike, 
    size:number,
    layersOrder:LayerInput[],
    format:{
        width:number;
        height:number;
        smoothing:boolean;
    },
    background:{
        generate:boolean;
        static?:boolean,
        default?:string,
        brightness?:number,
    },
    dnaCollisionTolerance:number,
    rarityDelimiter:string,
    rarityDefault:string,
    shuffleIndexes:boolean,
    debugLogs:boolean
}
interface CollectionAttributes{
    name:string;
    dir:fs.PathLike;
    description:string;
}
interface LayerElement{
    id:number;
    name:string;
    filename:string;
    path: string;
    weight:number;
}
interface Layer{
    id:number;
    name:string;
    elements: LayerElement[];
    totalWeight:number;
}
interface MetadataAttribute{
    trait_type:string;
    value:string;
}
interface Metadata{
    name:string;
    description:string;
    image:fs.PathLike;
    attributes:MetadataAttribute[];
}


export class Collection{
    name:string;
    dir:fs.PathLike;
    description:string = "";
    
    protected baseURL:string = "ipfs:/";
    protected extraMetadata:object = {}
    protected schema?:LayerSchema = undefined;
    protected layers?:Layer[] = undefined;

    constructor(attributes:CollectionAttributes){
        this.name = attributes.name;
        this.description = attributes.description;
        this.dir = attributes.dir;
    }

    setBaseURL(url:string){
        this.baseURL = url;
    }
    setExtraMetadata(data:object){
        this.extraMetadata = data;
    }
    setSchema(schema:LayerSchema){
        const getElements = (dir:fs.PathLike, rarityDelimiter:string) => {
            const cleanName = (str:string) => str.split('.').shift()?.split(rarityDelimiter).shift();
            const rarityWeight = (str:string) => str.split('.').shift()?.split(rarityDelimiter).pop();
            
            return fs
                .readdirSync(dir)
                .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
                .map((i, index) => {
                    if (i.includes("-")) {
                        throw new Error(`File name can not contain dashes, please fix: ${i}`);
                    }
                    let eleName = cleanName(i);
                    if( !eleName ){
                        throw new Error(`Error in loading File ${i}`);
                    }
                    let eleWeight = i.includes(schema.rarityDelimiter) ? rarityWeight(i) : schema.rarityDefault;
                    if ( !eleWeight ){
                        throw new Error(`Error in loading File ${i}`);
                    }
                    let element:LayerElement = {
                        id: index,
                        name: eleName,
                        filename: i,
                        path: path.join(dir.toString(), i),
                        weight: parseInt(eleWeight)
                    }
                    //console.log("DEBUG element", element);
                    return element;
                });
        }
        const layers:Layer[] = schema.layersOrder.map((layerObj, index) => {
            let dir = layerObj.dir ? layerObj.dir : path.join(schema.dir.toString(), layerObj.name);
            let elements = getElements(dir, schema.rarityDelimiter);
            var totalWeight:number = 0;
            elements.forEach((element) => {
                totalWeight += element.weight;
            });
            return {
                id: index,
                name: layerObj.name,
                elements: elements,
                totalWeight: totalWeight
            };
        })
        console.log("DEBUG layers", layers);
        this.schema = schema;
        this.layers = layers;
    }

    async generate(){
        if(!this.schema || !this.layers){
            throw new Error("Schema required for generating NFTs");
        }
        if (fs.existsSync(this.dir)) {
            fs.rmdirSync(this.dir, {recursive:true});
        }
        fs.mkdirSync(this.dir);
        fs.mkdirSync(`${this.dir}/metadata`);
        fs.mkdirSync(`${this.dir}/assets`);

        let indexCount:number = 1;
        let failedCount:number = 0;
        let abstractedIndexes:number[] = [];

        for (let i=1; i <= this.schema.size; i++) {
            abstractedIndexes.push(i);
        }

        const shuffle = (array:number[]) => {
            for (let i = array.length - 1; i > 0; i--) {
              let j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
        }
        if (this.schema.shuffleIndexes) {
            shuffle(abstractedIndexes);
        }
        this.schema.debugLogs
            ? console.log("Assets left to create: ", abstractedIndexes)
            : null;
        
        const DNA_DELIMITER = '-';
        const createDna = (layers:Layer[]) => {
            let randomElementIds:number[] = [];
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
        const isDnaUnique = (_dnaList:Set<string>, _dna:string) => {
            return !_dnaList.has(_dna);
        };
        const selectElements = (_dna:string, _layers:Layer[]) => {
            //console.log("DEBUG DNA", _dna, "\n");
            let mappedDnaToLayers = _layers.map((layer, index) => {
                let selectedElement:LayerElement|undefined = layer.elements.find(
                  (e) => (e.id.toString() == _dna.split(DNA_DELIMITER)[index])
                );
                if(selectedElement == undefined){
                    throw new Error("Something went wrong");
                }
                return selectedElement;
              });
              return mappedDnaToLayers;
        };
        const loadImage = async (element:LayerElement) => {
            try {
              return new Promise<canvas.Image>(async (resolve) => {
                const image = await canvas.loadImage(element.path);
                resolve(image);
              });
            } catch (error) {
              console.error(`Error loading image ${element.path}:`, error);
            }
        };
        const saveImage = (_index:number) => {
            fs.writeFileSync(`${this.dir}/assets/${_index}.png`, canvasInstance.toBuffer("image/png"));
        };
        const addMetadata = (_index:number) => {
            let dateTime = Date.now();
            let tempMetadata:Metadata = {
                name: `${this.name} #${_index}`,
                description: this.description,
                image: `${this.baseURL}/${_index}.png`,
                attributes: attributesList,
                ...this.extraMetadata
            };
            metadataList.push(tempMetadata);
            return tempMetadata;
        }
        const saveMetadata = (metadata:Metadata, _index:number) => {
            fs.writeFileSync(`${this.dir}/metadata/${_index}.json`, JSON.stringify(metadata, null, 2));
        };

        var dnaList = new Set<string>();

        const canvasInstance = canvas.createCanvas(this.schema.format.width, this.schema.format.height);
        const ctx = canvasInstance.getContext("2d");
        ctx.imageSmoothingEnabled = this.schema.format.smoothing;

        var metadataList:Metadata[] = [];
        var attributesList:MetadataAttribute[] = [];

        while (indexCount <= this.schema.size) {
            let newDna = createDna(this.layers);
            //console.log("DEBUG DNA", newDna);
            if (isDnaUnique(dnaList, newDna)) {
                let selectedElements:LayerElement[] = selectElements(newDna, this.layers);
                //console.log("DEBUG", selectedElements);

                let loadedImages:Promise<canvas.Image|undefined>[] = [];
          
                selectedElements.forEach((element) => {
                    loadedImages.push(loadImage(element));
                });
          
                await Promise.all(loadedImages).then((renderImageArray) => {
                    if(!this.schema || !this.layers){
                        throw new Error("Schema not found");
                    }
                    
                    this.schema.debugLogs ? console.log("Clearing canvas") : null;

                    ctx.clearRect(0, 0, this.schema.format.width, this.schema.format.height);
                    
                    if (this.schema.background.generate) {
                        if(this.schema.background.static){
                            if( !this.schema.background.default ){
                                throw new Error("Default color is required for static background")
                            }
                            ctx.fillStyle = this.schema.background.default;
                        }
                        else{
                            ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 100%, ${this.schema.background.brightness ? this.schema.background.brightness : "50%" })`;
                        }
                        
                        ctx.fillRect(0, 0, this.schema.format.width, this.schema.format.height);
                    }

                    renderImageArray.forEach((img, index) => {
                        if(!this.schema || !this.layers){
                            throw new Error("Schema not found");
                        }
                        ctx.drawImage(img, 0, 0, this.schema.format.width, this.schema.format.height);
                        attributesList.push({
                            trait_type: this.layers[index].name,
                            value: selectedElements[index].name,
                        });
                    });
                    
                    this.schema.debugLogs ? console.log("Editions left to create: ", abstractedIndexes) : null;
                    
                    saveImage(abstractedIndexes[0]);
                    let meta = addMetadata(abstractedIndexes[0]);
                    saveMetadata(meta, abstractedIndexes[0]);
                    //console.log(`Created index: ${abstractedIndexes[0]}, with DNA: ${newDna}`);
                });
                  
                attributesList = [];
                dnaList.add(newDna);
                indexCount++;
                abstractedIndexes.shift();
            } else {
                //console.log("DNA exists!");
                failedCount++;
                if (failedCount >= this.schema.dnaCollisionTolerance) {
                    throw new Error(`DNA Tolerance exceeded. More layers or elements are requierd to generate ${this.schema.size} images`);
                }
            }
        }
        console.log(`\n${this.schema.size} NFTs generated for ${this.name} in ${this.dir}\n`)
    }
}