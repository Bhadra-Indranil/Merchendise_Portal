import { Router } from "express";
import { authenticate, authorizeRoles, AuthRequest } from "./middleware/auth";
import { GroupOrder, GroupOrderDocument } from "./models/GroupOrder";
import { Product } from "./models/Product"; // Import Product model
import { Order } from "./models/Order"; // Import Order model
import mongoose from 'mongoose';

// Helper to generate a unique code
function generateUniqueCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const router = Router();

// Create a group order (dept_head or admin)
router.post(
  "/",
  authenticate,
  authorizeRoles("dept_head", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const { name, department, deadline, note, products } = req.body;

      if (!products || products.length === 0) {
        return res.status(400).json({ message: "Group order must have products" });
      }

      // Generate a unique code and ensure it's unique in the database
      let uniqueCode = generateUniqueCode();
      let existingGroup = await GroupOrder.findOne({ uniqueCode });
      while (existingGroup) {
        uniqueCode = generateUniqueCode();
        existingGroup = await GroupOrder.findOne({ uniqueCode });
      }

      const created = await GroupOrder.create({
        name,
        department,
        deadline,
        note,
        products, // Assign products from request body
        uniqueCode, // Assign generated unique code
        createdBy: req.user!.id,
        collectedAmount: 0, // Initialize
        totalQuantityCollected: 0, // Initialize
      });
      return res.status(201).json({ group: created });
    } catch (err) {
      return res.status(400).json({ message: "Failed to create group order" });
    }
  }
);

// List all groups (admin)
router.get("/", authenticate, authorizeRoles("admin", "dept_head"), async (_req, res) => {
  const groups = await GroupOrder.find()
    .populate('products.productId')
    .sort({ createdAt: -1 });
  return res.json({ groups });
});

// Get group order details by unique code (public)
router.get("/:uniqueCode", async (req, res) => {
  try {
    const group = await GroupOrder.findOne({ uniqueCode: req.params.uniqueCode }).populate('products.productId');

    if (!group) {
      return res.status(404).json({ message: "Group order not found" });
    }
    return res.json({ group });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update status (dept_head/admin)
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("dept_head", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (status === 'closed') {
        const groupOrder = await GroupOrder.findById(req.params.id) as GroupOrderDocument;
        if (!groupOrder) return res.status(404).json({ message: "Group order not found" });

        const individualOrders = await Order.find({ groupOrder: groupOrder._id, status: 'paid' });

        const bulkOrderItems: { product: mongoose.Types.ObjectId; quantity: number; unitPrice: number }[] = [];
        let totalBulkAmount = 0;

        individualOrders.forEach(order => {
          order.items.forEach(item => {
            const existingItem = bulkOrderItems.find(bulkItem => bulkItem.product.equals(item.product));
            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              bulkOrderItems.push({
                product: item.product,
                quantity: item.quantity,
                unitPrice: item.unitPrice, // Assuming unit price is consistent
              });
            }
            totalBulkAmount += item.quantity * item.unitPrice;
          });
        });

        if (bulkOrderItems.length > 0) {
          // Create a single bulk order
          await Order.create({
            user: groupOrder.createdBy, // The group admin places the bulk order
            groupOrder: groupOrder._id,
            items: bulkOrderItems,
            amount: totalBulkAmount,
            status: 'paid', // Assuming it's paid as individual orders were paid
            paymentProvider: 'razorpay', // Or a new 'group_order' provider
            notes: `Bulk order for Group Order: ${groupOrder.name} (${groupOrder.uniqueCode})`,
          });

          // Update collected amounts in GroupOrder
          groupOrder.collectedAmount = totalBulkAmount;
          groupOrder.totalQuantityCollected = bulkOrderItems.reduce((sum, item) => sum + item.quantity, 0);
          await groupOrder.save();
        }
      }

      const updated = await GroupOrder.findByIdAndUpdate(
        req.params.id,
        { status: status },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Not found" });
      return res.json({ group: updated });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;