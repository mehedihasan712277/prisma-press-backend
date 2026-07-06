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
            statusCode: httpStatus.OK,
            message: "comment created successfully",
            data: result,
        });
    },
);

const getCommentByAuthorId = catchAsync(
    (req: Request, res: Response, next: NextFunction) => {},
);
const getCommentbyCommentId = catchAsync(
    (req: Request, res: Response, next: NextFunction) => {},
);
const updateComment = catchAsync(
    (req: Request, res: Response, next: NextFunction) => {},
);
const deleteComment = catchAsync(
    (req: Request, res: Response, next: NextFunction) => {},
);
const moderateComment = catchAsync(
    (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentbyCommentId,
    updateComment,
    deleteComment,
    moderateComment,
};
