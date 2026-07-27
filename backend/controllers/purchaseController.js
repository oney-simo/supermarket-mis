const Supplier = require('../models/supplier');
const Purchase = require('../models/purchase');
const PurchaseItem = require('../models/purchaseItems');
const { logActivity } = require('../services/activityLogger');


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

        // Check supplier exists
const supplierExists = await Supplier.findById(supplier);

if (!supplierExists) {
    return res.status(404).json({
        message: "Supplier not found"
    });
}


        if (!items || items.length === 0){
            return res.status(400).json({
                message:"Purchase must contain at least one product"
            });
        }


        const purchase = await Purchase.create({
            supplier,
            invoiceNumber,
            purchaseDate,
            totalAmount,
            status,
            paymentStatus,
            notes
        });


        const purchaseItems = (items || []).map(item => ({
            purchase: purchase._id,
            product: item.product,
            quantity: item.quantity,
            buyingPrice: item.buyingPrice,
            subtotal: item.quantity * item.buyingPrice
        }));


        await PurchaseItem.insertMany(purchaseItems);

        await logActivity({
            req,
            user: { userId: req.user?.userId },
            action: 'create',
            module: 'Purchases',
            description: `Created purchase ${purchase.invoiceNumber}`,
            referenceId: purchase._id.toString(),
            referenceModel: 'Purchase'
        });

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


        await logActivity({
            req,
            user: { userId: req.user?.userId },
            action: 'delete',
            module: 'Purchases',
            description: `Deleted purchase ${purchase.invoiceNumber}`,
            referenceId: purchase._id.toString(),
            referenceModel: 'Purchase'
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