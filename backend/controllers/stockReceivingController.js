const StockReceiving = require('../models/StockReceiving');
const Inventory = require('../models/Inventory');


// RECEIVE STOCK
exports.receiveStock = async (req, res) => {

    try {

        const {
            purchase,
            product,
            quantityReceived,
            batchNumber,
            manufacturingDate,
            expiryDate,
            condition
        } = req.body;


        // Create receiving record
        const receiving = await StockReceiving.create({
            purchase,
            product,
            quantityReceived,
            batchNumber,
            manufacturingDate,
            expiryDate,
            condition
        });


        // If goods are good, add to inventory
        if (condition === 'Good' || !condition) {

            const inventory = await Inventory.create({
                product,
                batchNumber,
                quantity: quantityReceived,
                manufacturingDate,
                expiryDate,
                receivedDate: new Date()
            });


            return res.status(201).json({
                message: "Stock received successfully",
                receiving,
                inventory
            });

        }


        res.status(201).json({
            message: "Damaged stock recorded",
            receiving
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};



// GET ALL RECEIVING RECORDS
exports.getReceiving = async (req, res) => {

    try {

        const receiving = await StockReceiving.find()
        .populate('purchase')
        .populate('product')
        .sort({createdAt:-1});


        res.status(200).json(receiving);


    } catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};



// GET SINGLE RECEIVING
exports.getReceivingById = async(req,res)=>{

    try{

        const receiving = await StockReceiving.findById(req.params.id)
        .populate('purchase')
        .populate('product');


        if(!receiving){

            return res.status(404).json({
                message:"Receiving record not found"
            });

        }


        res.status(200).json(receiving);


    }catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};