import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN, Role.USER, Role.AUTHUR),
    commentController.createComment,
);
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.get("/:commentId", commentController.getCommentbyCommentId);
router.patch(
    "/:commentId",
    auth(Role.ADMIN, Role.USER, Role.AUTHUR),
    commentController.updateComment,
);
router.delete(
    "/:commentId",
    auth(Role.ADMIN, Role.USER, Role.AUTHUR),
    commentController.deleteComment,
);
router.put(
    "/:commentId/moderate",
    auth(Role.ADMIN),
    commentController.moderateComment,
);

export const commnetRoutes = router;
