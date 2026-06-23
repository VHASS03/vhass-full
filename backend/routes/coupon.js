import express from "express";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} from "../controllers/coupon.js";

const router = express.Router();

// ── Public: validate a coupon during checkout ────────────────────────────
router.post("/validate", isAuth, validateCoupon);

// ── Admin: coupon management ─────────────────────────────────────────────
router.get("/admin", isAuth, isAdmin, getAllCoupons);
router.post("/admin", isAuth, isAdmin, createCoupon);
router.put("/admin/:id", isAuth, isAdmin, updateCoupon);
router.delete("/admin/:id", isAuth, isAdmin, deleteCoupon);
router.patch("/admin/:id/toggle", isAuth, isAdmin, toggleCoupon);

export default router;
