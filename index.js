const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/audio/:id", async (req, res) => {
    const assetId = req.params.id;

    try {
        const product = await axios.get(
            `https://apis.roblox.com/marketplace-items/v1/items/details`,
            { params: { itemIds: assetId } }
        );

        const item = product.data?.data?.[0];

        if (!item) {
            return res.json({ success: false, error: "No item found" });
        }

        const thumbRes = await axios.get(
            `https://thumbnails.roblox.com/v1/assets`,
            {
                params: {
                    assetIds: assetId,
                    size: "420x420",
                    format: "Png"
                }
            }
        );

        const thumbData = thumbRes.data?.data?.[0];

        res.json({
            success: true,
            creatorType: item.creatorType,
            creatorId: item.creatorTargetId,
            hasThumbnail: thumbData && thumbData.imageUrl !== null,
            thumbnailUrl: thumbData?.imageUrl || null
        });

    } catch (err) {
        res.json({ success: false });
    }
});

app.listen(3000, () => {
    console.log("Server running");
});
