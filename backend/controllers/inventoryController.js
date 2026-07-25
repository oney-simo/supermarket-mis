const Inventory = require('../models/Inventory');


// GET ALL INVENTORY
exports.getInventory = async (req, res) => {

    try {

        const inventory = await Inventory.find()
        .populate('product')
        .sort({ createdAt: -1 });


        res.status(200).json(inventory);


    } catch(error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};



// GET INVENTORY BY PRODUCT
exports.getInventoryByProduct = async (req, res) => {

    try {

        const inventory = await Inventory.find({
            product: req.params.productId
        })
        .populate('product');


        if(!inventory.length){

            return res.status(404).json({
                message: "No stock found for this product"
            });

        }


        res.status(200).json(inventory);


    } catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};



// GET EXPIRING PRODUCTS
exports.getExpiringProducts = async (req,res)=>{

    try{

        const today = new Date();

        const inventory = await Inventory.find({
            expiryDate:{
                $gte: today
            }
        })
        .populate('product')
        .sort({
            expiryDate:1
        });


        res.status(200).json(inventory);


    }catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};