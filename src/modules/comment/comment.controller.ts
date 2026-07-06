import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const authorId = req.user?.id;
        const result = await commentService.createCommentIntoDB(
            payload,
            authorId as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Comment created successfully",
            data: result,
        });
    },
);

const getCommentByAuthorId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.params.authorId;
        if (!authorId) {
            throw new Error("Author is not found");
        }
        const result = await commentService.getCommentByAuthorIdFromDB(
            authorId as string,
        );
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Comment retrived successfully",
            data: result,
        });
    },
);
const getCommentbyCommentId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const commentId = req.params.commentId;
        if (!commentId) {
            throw new Error("Comment not found");
        }

        const result = await commentService.getCommentbyCommentIdFromDB(
            commentId as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Comment details retrived successfully",
            data: result,
        });
    },
);
const updateComment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const commentId = req.params.commentId;
        if (!commentId) {
            throw new Error("Comment not found");
        }
        const authorId = req.user?.id;
        const result = await commentService.updateCommentInDB(
            commentId as string,
            payload,
            authorId as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Comment updated successfully",
            data: result,
        });
    },
);
const deleteComment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const commentId = req.params.commentId;
        if (!commentId) {
            throw new Error("Comment id not found");
        }
        const authorId = req.user?.id;

        const result = await commentService.deleteCommentFromDB(
            commentId as string,
            authorId as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Comment deleted successfully",
            data: result,
        });
    },
);
const moderateComment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentbyCommentId,
    updateComment,
    deleteComment,
    moderateComment,
};
