import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postServices } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const id = req.user?.id;

        const result = await postServices.createPostIntoDB(
            payload,
            id as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Post created successfully",
            data: result,
        });
    },
);

const getAllPosts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await postServices.getAllPostFromDB();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All post retrived successfully",
            data: result,
        });
    },
);

const getPostById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const updatePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const deletePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const getPostStats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const getMyPosts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostStats,
    getMyPosts,
};
