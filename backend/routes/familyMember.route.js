import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { listFamilyMembers, createFamilyMember, updateFamilyMember, deleteFamilyMember, getFamilyMemberById } from "../controllers/familyMember.controller.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", listFamilyMembers);
router.post("/", createFamilyMember);
router.put("/:id", updateFamilyMember);
router.delete("/:id", deleteFamilyMember);
router.get("/:id", getFamilyMemberById);

export default router;


