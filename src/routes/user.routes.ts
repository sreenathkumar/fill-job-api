import { getUser, updateUser } from "@/controllers/user.controller";
import authenticate from "@/middlewares/auth.middleware";
import { Router } from "express";

const router: Router = Router()

router.get('/', authenticate, getUser);
router.patch('/', authenticate, updateUser);

export default router