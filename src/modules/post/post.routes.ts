import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.post(
    "/",
    auth(Role.USER, Role.ADMIN, Role.AUTHUR),
    postController.createPost,
);
router.get("/", postController.getAllPosts);
router.get("/stats", auth(Role.ADMIN), postController.getPostStats);
router.get(
    "/my-posts",
    auth(Role.USER, Role.ADMIN, Role.AUTHUR),
    postController.getMyPosts,
);
router.get("/:postId", postController.getPostById);
router.patch(
    "/:postId",
    auth(Role.USER, Role.ADMIN, Role.AUTHUR),
    postController.updatePost,
);
router.delete(
    "/:postId",
    auth(Role.USER, Role.ADMIN, Role.AUTHUR),
    postController.deletePost,
);

export const postRoutes = router;
