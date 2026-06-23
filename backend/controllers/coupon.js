import { Coupon } from "../models/Coupon.js";

// ─── Helper: compute final discount amount ────────────────────────────────
export const computeDiscount = (coupon, originalAmount) => {
  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (originalAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount !== null) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }
  // Discount can't exceed original price
  discountAmount = Math.min(discountAmount, originalAmount);
  return Math.round(discountAmount);
};

// ─── Validate & preview a coupon (public — called from checkout) ──────────
export const validateCoupon = async (req, res) => {
  try {
    const { code, amount, type } = req.body; // type: 'course' | 'workshop'

    if (!code || !amount) {
      return res.status(400).json({ message: "Coupon code and amount are required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "This coupon is no longer active" });
    }

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return res.status(400).json({ message: "This coupon is not valid yet" });
    }
    if (coupon.validUntil && now > coupon.validUntil) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: "This coupon has reached its usage limit" });
    }

    if (Number(amount) < coupon.minimumAmount) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minimumAmount} required for this coupon`,
      });
    }

    // Check applicability
    if (coupon.applicableTo !== "all") {
      const itemType = type === "workshop" ? "workshops" : "courses";
      if (coupon.applicableTo !== itemType) {
        return res.status(400).json({
          message: `This coupon is only valid for ${coupon.applicableTo}`,
        });
      }
    }

    const discountAmount = computeDiscount(coupon, Number(amount));
    const finalAmount = Number(amount) - discountAmount;

    return res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
      },
      discountAmount,
      finalAmount,
      savings: discountAmount,
      message: `Coupon applied! You save ₹${discountAmount}`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Error validating coupon", error: error.message });
  }
};

// ─── Admin: Get all coupons ────────────────────────────────────────────────
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (error) {
    console.error("Error getting coupons:", error);
    res.status(500).json({ message: "Failed to retrieve coupons", error: error.message });
  }
};

// ─── Admin: Create a coupon ────────────────────────────────────────────────
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minimumAmount,
      applicableTo,
      maxUses,
      validFrom,
      validUntil,
      isActive,
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({ message: "Code, discountType, and discountValue are required" });
    }

    // Check for duplicate code
    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: `Coupon code "${code.toUpperCase()}" already exists` });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description: description || "",
      discountType,
      discountValue: Number(discountValue),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      minimumAmount: minimumAmount ? Number(minimumAmount) : 0,
      applicableTo: applicableTo || "all",
      maxUses: maxUses ? Number(maxUses) : null,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: validUntil ? new Date(validUntil) : null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user?._id,
    });

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "A coupon with this code already exists" });
    }
    res.status(500).json({ message: "Failed to create coupon", error: error.message });
  }
};

// ─── Admin: Update a coupon ────────────────────────────────────────────────
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    const fields = [
      "description", "discountType", "discountValue", "maxDiscount",
      "minimumAmount", "applicableTo", "maxUses", "validFrom", "validUntil", "isActive",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) coupon[f] = req.body[f];
    });

    await coupon.save();
    res.json({ message: "Coupon updated", coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Failed to update coupon", error: error.message });
  }
};

// ─── Admin: Delete a coupon ────────────────────────────────────────────────
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    await coupon.deleteOne();
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Failed to delete coupon", error: error.message });
  }
};

// ─── Admin: Toggle active state ────────────────────────────────────────────
export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}`, coupon });
  } catch (error) {
    console.error("Error toggling coupon:", error);
    res.status(500).json({ message: "Failed to toggle coupon", error: error.message });
  }
};
