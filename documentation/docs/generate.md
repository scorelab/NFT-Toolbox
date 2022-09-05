---
sidebar_position: 2
---

# Generate Collections

NFT Toolbox provides the functionality for generating Image and Metadata files for an NFT Collection
by super-imposing Layer Images according to a schema. This is a popular method for creating collections
in the NFT community. Read more about it [here](https://danewesolko.com/how-to-create-layers-for-nft-art-projects/).

## Layer Images

To generate NFT Images you will first need a directory of Layer Images.
The structure of this directory and the file names of images are used to generate the metadata files for the collection.
So they must be as described below.

### Directory Structure

Images of each Layer should be in a separate directory. These Layer directories should all preferrably be in a parent directory.
But a separate path can be provided for each Layer directory.

Each Layer directory can optionally be named same as the **Layer Name** (Used as _trait_type_ in metadata attributes).

Each Layer directory must only contain image files with the same file format.

### File Name

The Image file names should be the **Image Name** (Used as the _value_ in metadata attributes).

The **Image Name** can optionally be appended with a **Rarity Delimiter** followed by its **Rarity Weight**.

The **Rarity Delimiter** is a character, preferrably non alpha-numeric, other than '.'

The **Rarity Weight** of an image is used to specify how frequently it is to be used instead of other images in the same Layer.
**Rarity Weight** must be a positive integer.

Examples of the two permissible file names would be _Black.png_ and _White#10.png_ where '#' is the **Rarity Delimiter**.

## Initialize a Collection

**After [Importing the package](/docs/intro#import-it-in-your-project),**

Call the `initCollection` function to initialize a Collection with the basic details.

```javascript
nftToolbox.initCollection({
	name: "Your Collection",
	dir: "/path/to/directory/Your Collection/",
	description: "Short description for Your Collecion",
});
```

## Provide a Schema

Call the `generateNFTs` function with a **Schema** object to start the generation.

```javascript
nftToolbox.generateNFTs({
	dir: "/path/to/directory/Layers/",
	size: 100,
	layersOrder: [
		{ name: "first layer" },
		{ name: "second layer" },
		{ name: "third layer", dir: "/path/to/other/directory/Third Layer/" },
	],
	format: {
		width: 512,
		height: 512,
		smoothing: true,
	},
	background: {
		generate: true;
		static: true;
		default?: string;
		brightness?: number;
	},
	dnaCollisionTolerance: 1000,
	rarityDelimiter: "#",
	rarityDefault: "1",
	shuffleIndexes: true,
});
```

The attributes of **Schema** object are described below.

| Name                      | Type    | Description                                                                           |
| ------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `dir`                     | string  | Path to parent directory containing Layer directories                                 |
| `size`                    | integer | Total number of images to be generated                                                |
| `layersOrder`             | array   | Array of Object containing `name` and `dir` in the Order of super-imposition.         |
| `layersOrder`>`name`      | string  | Name of Layer (Used as _trait_type_ in metadata attributes)                           |
| `layersOrder`>`dir`       | string  | _(optional)_ Path to Layer directory. Defaults to `Schema`>`dir`/`layersOrder`>`name` |
| `format`                  | object  | Object containing `width` `height` and `smoothing`                                    |
| `format`>`width`          | integer | Width of generated images in Pixels                                                   |
| `format`>`height`         | integer | Height of generated images in Pixels                                                  |
| `format`>`smoothing`      | boolean | Smoothen the Layer images after super-imposition                                      |
| `background`              | object  | Object containing `generate` `static` `default` and `brightness`                      |
| `background`>`generate`   | boolean | Add a Solid Background to all generated images                                        |
| `background`>`static`     | boolean | Use same color for all images or select colors randomly. Defaults to _false_          |
| `background`>`default`    | string  | Required if `static` is _true_. Hex string of color to be used                        |
| `background`>`brightness` | integer | Brightness of Solid Background to be added. Defaults to 50%                           |
| `dnaCollisionTolerance`   | integer | Number of collisions required to conclude that too few layer images are provided      |
| `rarityDelimiter`         | string  | The character used as Rarity Delimiter                                                |
| `rarityDefault`           | integer | Default value of Rarity Weight to be used for images when not specified in file name  |
| `shuffleIndexes`          | boolean | Generate Indexes in a shuffled order                                                  |

:::note
The `generateNFTs` function creates Image and Metadata files in `assets` and `metadata`
directories inside the Collection Directory.
:::

:::caution
Images and Metadata files will be created by `generateNFTs` function in the directory path provided as
`dir` to `initCollection` function. Present contents in the directory if any will be deleted.
:::
