import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(
    (req: Request, res: Response, next: NextFunction) => {},
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
