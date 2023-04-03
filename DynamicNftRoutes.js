const express = require("express");
const router = express.Router();
const { Revise } = require("revise-sdk");
// const { fetchGoals } = require("./data.js");
const AUTH_TOKEN ="";
const revise = new Revise({ auth: AUTH_TOKEN });

router.get("/get-football-nft/:id", async (req, res) => {
  try {
    let nftId = req.params.id;
    let nftData = await revise.fetchNFT(nftId);
    const nft = revise.nft(nftData);
    let nftmetaData = nft.nft.metaData;
    return res.json({
      message: "Successfully Retrieve Data",
      properties: nftmetaData,
      data: nftData,
    });
  } catch (error) {
    return res.json({ message: "Server Error" });
  }
});

router.get("/all-nfts/:collectionID", async (req, res) => {
  try {
    let collectionId = req.params.collectionID;
    let nftsData = await revise.fetchNFTs(collectionId);

    return res.json({
      message: "Successfully Retrieve Data",

      data: nftsData,
    });
  } catch (error) {
    return res.json({ message: "Server Error" });
  }
});

router.post("/edit-nft/:id", async (req, res) => {
  const props = req.body;
  try {
    let nftId = req.params.id;
    let previousnftData = await revise.fetchNFT(nftId);
    let saveData;
    for (let key in props) {
      saveData = await (
        await revise.updateNFT(nftId)
      ).setProperty(key.toString(), props[key].toString());
    }

    saveData.save();

    let updatenftData = await revise.fetchNFT(nftId);
    return res.json({
      message: "Successfully Retrieve Data",
      previousData: previousnftData,
      updatedata: updatenftData,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit-nft-name/:id", async (req, res) => {
  const name = req.body.name;
  try {
    let nftId = req.params.id;
    let previousnftData = await revise.fetchNFT(nftId);

    if (name) {
      await (await revise.updateNFT(nftId)).setName(name.toString()).save();
    }

    let updatenftData = await revise.fetchNFT(nftId);
    return res.json({
      message: "Successfully Retrieve Data",
      previousData: previousnftData,
      updatedata: updatenftData,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit-nft-description/:id", async (req, res) => {
  const description = req.body.description;
  try {
    let nftId = req.params.id;
    let previousnftData = await revise.fetchNFT(nftId);

    if (description) {
      await (await revise.updateNFT(nftId))
        .setDescription(description.toString())
        .save();
    }

    let updatenftData = await revise.fetchNFT(nftId);
    return res.json({
      message: "Successfully Retrieve Data",
      previousData: previousnftData,
      updatedata: updatenftData,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit-nft-image/:id", async (req, res) => {
  const image = req.body.image;
  try {
    let nftId = req.params.id;
    let previousnftData = await revise.fetchNFT(nftId);

    if (image) {
      await (await revise.updateNFT(nftId)).setImage(image.toString()).save();
    }

    let updatenftData = await revise.fetchNFT(nftId);
    return res.json({
      message: "Successfully Retrieve Data",
      previousData: previousnftData,
      updatedata: updatenftData,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("nft-ipfs-link/:nftId", async (req, res) => {
  try {
    let id = req.params.nftId;
    let nft = await revise.fetchNFT(id);
    let ipfsLink = await revise.nft(nft).export();
    return res.json({
      message: "Successfully Retrieve Data",
      link: ipfsLink,
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;