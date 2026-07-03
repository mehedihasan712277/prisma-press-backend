import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
    "/me",
    auth(Role.ADMIN, Role.AUTHUR, Role.USER),
    userController.getMyProfile,
);

export const userRoutes = router;
