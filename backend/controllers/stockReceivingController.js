const StockReceiving = require('../models/stockReceiving');
const Inventory = require('../models/inventory');
const Purchase = require('../models/purchase');


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


        // Check purchase exists
        const existingPurchase = await Purchase.findById(purchase);

        if (!existingPurchase) {
            return res.status(404).json({
                message: "Purchase not found"
            });
        }


        // Prevent duplicate receiving
        if (
            existingPurchase.status === "Received" ||
            existingPurchase.status === "Completed"
        ) {
            return res.status(400).json({
                message: "This purchase has already been received"
            });
        }


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



        // Add only good stock into inventory
        if (condition === "Good" || !condition) {


            let inventory = await Inventory.findOne({

                product,
                batchNumber

            });



            if (inventory) {


                // Increase existing batch quantity
                inventory.quantity += quantityReceived;

                await inventory.save();


            } else {


                // Create new inventory batch
                inventory = await Inventory.create({

                    product,
                    batchNumber,
                    quantity: quantityReceived,
                    manufacturingDate,
                    expiryDate,
                    receivedDate: new Date()

                });


            }



            // Update purchase status
            existingPurchase.status = "Received";

            await existingPurchase.save();



            return res.status(201).json({

                message: "Stock received successfully",

                receiving,

                inventory

            });


        }



        // Damaged stock response
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

            .sort({ createdAt: -1 });



        res.status(200).json(receiving);



    } catch(error) {


        res.status(500).json({

            message: "Server error",

            error: error.message

        });


    }

};




// GET SINGLE RECEIVING
exports.getReceivingById = async (req, res) => {

    try {


        const receiving = await StockReceiving.findById(req.params.id)

            .populate('purchase')

            .populate('product');



        if (!receiving) {

            return res.status(404).json({

                message: "Receiving record not found"

            });

        }



        res.status(200).json(receiving);



    } catch(error) {


        res.status(500).json({

            message: "Server error",

            error: error.message

        });


    }

};