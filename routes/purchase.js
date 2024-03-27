
const express = require("express");
const Purchase = require("../models/Purchase");
const Item = require("../models/Item");
const Menu = require("../models/Menu");
const router = express.Router();

router.get("/purchase/stockQty", async (req, res) => {
  try {
    const itemName = req.query.itemName;
    const item = await Item.findOne({
      itemName: { $regex: new RegExp(itemName, "i") },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ stockQty: item.stockQty });
  } catch (error) {
    console.error("Error fetching stock quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/purchases", async (req, res) => {
  try {
    const purchases = await Purchase.find();
    console.log(purchases);
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific purchase by ID
router.get("/purchases/:id", getPurchase, (req, res) => {
  res.json(res.purchase);
});

// Middleware function to get a purchase by ID
async function getPurchase(req, res, next) {
  let purchase;
  try {
    purchase = await Purchase.findById(req.params.id);
    if (purchase == null) {
      return res.status(404).json({ message: "Purchase not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.purchase = purchase;
  next();
}
router.get("/purchases-total", async (req, res) => {
  try {
    const purchases = await Purchase.find();

    // Calculate total balance
    const totalBalance = purchases.reduce((acc, purchase) => acc + purchase.balance, 0);

    // Send only the total balance in the response
    res.json({ totalBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/purchase/addItem", async (req, res) => {
  try {
    const { billNo, productName, quantity, unit, pricePerQty, gst } = req.body;

    // Check if a purchase with the same billNo already exists
    const existingPurchase = await Purchase.findOne({ billNo });
    if (existingPurchase) {
      return res.status(400).json({ error: "Duplicate bill number" });
    }

    // Find the existing purchase or create a new one
    let purchase = await Purchase.findOne({ billNo });

    if (!purchase) {
      purchase = new Purchase({
        billNo,
        items: [],
        subtotal: 0,
        gstPercentage: 0,
        gstAmount: 0,
        paidAmount: 0,
        grandTotal: 0,
        discount: 0,
      });
    }

    // Calculate GST amount for the new item
    const gstAmount = (parseFloat(quantity) * parseFloat(pricePerQty) * parseFloat(gst)) / 100;

    // Add the new item to the items array
    purchase.items.push({
      productName,
      quantity,
      unit,
      pricePerQty,
      gst,
      gstAmount,
    });

    // Update subtotal and GST amount based on the new item
    purchase.subtotal += parseFloat(quantity) * parseFloat(pricePerQty);
    purchase.gstAmount += gstAmount;

    const item = await Item.findOne({ itemName: productName });
    if (item) {
      item.stockQty -= parseFloat(quantity); // Adjust stock quantity
      await item.save();
    }

    // Save the updated purchase
    const savedPurchase = await purchase.save();
    res.json(savedPurchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// router.post("/purchase/savebill", async (req, res) => {
//     try {
//       const {
//         date,
//         billNo,
//         vendor,
//         subtotal,
//         gst,
//         gstAmount,
//         grandTotal,
//         paidAmount,
//         discount,
//         balance,
//         items,
//       } = req.body;
  
//       // Check if a purchase with the same billNo already exists
//       const existingPurchase = await Purchase.findOne({ billNo });
//       if (existingPurchase) {
//         return res.status(400).json({ error: "Duplicate bill number" });
//       }
  
//       // Find or create the purchase
//       let purchase = new Purchase({
//         date,
//         billNo,
//         vendorName: vendor,
//         subtotal,
//         grandTotal,
//         gst,
//         gstAmount,
//         paidAmount,
//         discount,
//         balance,
//         items,
//       });
  
//       // Iterate through purchased items to update stock quantity
//       for (const item of items) {
//         // Find the corresponding item in the database
//         const purchasedItem = await Item.findOne({ itemName: item.productName });
//         if (purchasedItem) {
//           // Update stock quantity based on the purchased quantity
//           purchasedItem.stockQty += parseFloat(item.quantity);
//           await purchasedItem.save();
//         }
//       }
  
//       const savedPurchase = await purchase.save();
//       res.json(savedPurchase);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });


router.post("/purchase/savebill", async (req, res) => {
  try {
      const {
          date,
          billNo,
          vendor,
          subtotal,
          gst,
          gstAmount,
          grandTotal,
          paidAmount,
          discount,
          balance,
          items,
      } = req.body;

      // Check if a purchase with the same billNo already exists
      const existingPurchase = await Purchase.findOne({ billNo });
      if (existingPurchase) {
          return res.status(400).json({ error: "Duplicate bill number" });
      }

      // Find or create the purchase
      let purchase = new Purchase({
          date,
          billNo,
          vendorName: vendor,
          subtotal,
          grandTotal,
          gst,
          gstAmount,
          paidAmount,
          discount,
          balance,
          items,
      });

      // Iterate through purchased items to update stock quantity
      for (const item of items) {
          // Update stock quantity for Items
          const purchasedItem = await Item.findOne({ itemName: item.productName });
          if (purchasedItem) {
              purchasedItem.stockQty += parseFloat(item.quantity);
              await purchasedItem.save();
          }
          
          // Update stock quantity for Menus
          const menu = await Menu.findOne({ name: item.productName });
          if (menu) {
              menu.stockQty += parseFloat(item.quantity);
              await menu.save();
          }
      }

      const savedPurchase = await purchase.save();
      res.json(savedPurchase);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



  
router.delete("/purchases/:id", getPurchase, async (req, res) => {
  try {
    await res.purchase.remove();
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE/EDIT a specific purchase by ID
router.patch("/purchases/:id", getPurchase, async (req, res) => {
  try {
    const {
      vendor,
      subtotal,
      grandTotal,
      gst,
      gstAmount,
      paidAmount,
      discount,
      balance,
      items,
    } = req.body;

    res.purchase.vendorName = vendor;
    res.purchase.subtotal = subtotal;
    res.purchase.grandTotal = grandTotal;
    res.purchase.gst = gst;
    res.purchase.gstAmount = gstAmount;
    res.purchase.paidAmount = paidAmount;
    res.purchase.discount = discount;
    res.purchase.balance = balance;
    res.purchase.items = items;

    // Iterate through purchased items to update stock quantity
    for (const item of items) {
      // Find the corresponding item in the database
      const purchasedItem = await Item.findOne({ itemName: item.productName });
      if (purchasedItem) {
        // Adjust stock quantity based on the difference in quantity
        purchasedItem.stockQty += (parseFloat(item.quantity) - parseFloat(item.originalQuantity));
        await purchasedItem.save();
      }
    }

    const updatedPurchase = await res.purchase.save();
    res.json(updatedPurchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;