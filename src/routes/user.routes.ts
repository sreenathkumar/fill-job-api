import { getUser } from "@/controllers/user.controller";
import authenticate from "@/middlewares/auth.middleware";
import { Router } from "express";

const router: Router = Router()

router.get('/', authenticate, getUser);

export default router