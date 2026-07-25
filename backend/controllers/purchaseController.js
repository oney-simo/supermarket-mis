const Purchase = require('../models/Purchase');
const PurchaseItem = require('../models/PurchaseItems');


// CREATE PURCHASE
exports.createPurchase = async (req, res) => {
    try {

        const {
            supplier,
            invoiceNumber,
            purchaseDate,
            totalAmount,
            status,
            paymentStatus,
            notes,
            items
        } = req.body;


        const purchase = await Purchase.create({
            supplier,
            invoiceNumber,
            purchaseDate,
            totalAmount,
            status,
            paymentStatus,
            notes
        });


        const purchaseItems = items.map(item => ({
            purchase: purchase._id,
            product: item.product,
            quantity: item.quantity,
            buyingPrice: item.buyingPrice,
            subtotal: item.quantity * item.buyingPrice
        }));


        await PurchaseItem.insertMany(purchaseItems);


        res.status(201).json({
            message: "Purchase created successfully",
            purchase,
            items: purchaseItems
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// GET ALL PURCHASES
exports.getPurchases = async (req, res) => {

    try {

        const purchases = await Purchase.find()
        .populate('supplier')
        .sort({createdAt:-1});


        res.status(200).json(purchases);


    } catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};



// GET SINGLE PURCHASE
exports.getPurchaseById = async(req,res)=>{

    try{

        const purchase = await Purchase.findById(req.params.id)
        .populate('supplier');


        const items = await PurchaseItem.find({
            purchase:req.params.id
        })
        .populate('product');


        if(!purchase){

            return res.status(404).json({
                message:"Purchase not found"
            });

        }


        res.status(200).json({
            purchase,
            items
        });


    }catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};



// DELETE PURCHASE
exports.deletePurchase = async(req,res)=>{

    try{

        const purchase = await Purchase.findByIdAndDelete(req.params.id);


        if(!purchase){

            return res.status(404).json({
                message:"Purchase not found"
            });

        }


        await PurchaseItem.deleteMany({
            purchase:req.params.id
        });


        res.status(200).json({
            message:"Purchase deleted successfully"
        });


    }catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    }

};