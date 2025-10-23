import e from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume
} from "../controllers/aiController.js";
// import { updateResume } from "../controllers/resumeController.js";

const aiRouter = e.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);


export default aiRouter