const Inventory = require('../models/inventory');
const { logActivity } = require('../services/activityLogger');


// GET ALL INVENTORY
exports.getInventory = async (req, res) => {

    try {

       const inventory = await Inventory.find()
.populate(
  'product',
  'name sku unit buyingPrice sellingPrice reorderLevel'
)
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


// CREATE INVENTORY BATCH
exports.createInventory = async (req, res) => {
    try {
        const {
            product,
            batchNumber,
            quantity,
            manufacturingDate,
            expiryDate,
            receivedDate,
            status
        } = req.body;

        if (!product || quantity === undefined || quantity === null) {
            return res.status(400).json({ message: 'Product and quantity are required' });
        }

        const inventory = new Inventory({
            product,
            batchNumber,
            quantity,
            manufacturingDate,
            expiryDate,
            receivedDate,
            status
        });

        const saved = await inventory.save();

        // populate product field for response
        await saved.populate('product');

        // log activity (optional if auth present)
        try {
            await logActivity({
                req,
                user: req.user ?? null,
                action: 'create',
                module: 'inventory',
                description: `Created inventory batch ${batchNumber || ''}`,
                referenceId: saved._id,
                referenceModel: 'inventory',
                metadata: { quantity }
            });
        } catch (e) {
            // swallow logging errors
            console.warn('Activity log failed:', e?.message || e);
        }

        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }

};