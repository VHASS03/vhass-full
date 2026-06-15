import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  phonepeCheckout,
  phonepeStatus,
  createCourse
} from "../controllers/course.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import { deleteCourse, addLectures } from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.get("/course/all", getAllCourses);

// Update lecture route to use uploadFiles middleware
router.post("/course/new", isAuth, isAdmin, createCourse);

// PhonePe payment endpoints - MUST come BEFORE generic /course/:id route
router.post("/course/:id/phonepe-checkout", isAuth, phonepeCheckout);
router.post("/course/phonepe/status/:merchantOrderId", phonepeStatus);

// Generic course routes - MUST come AFTER specific routes
router.post("/course/:id", isAuth, isAdmin, uploadFiles.fields([{ name: 'file', maxCount: 1 }]), addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);


export default router;
