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
            message: "All posts retrived successfully",
            data: result,
        });
    },
);

const getPostById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId;

        if (!postId) {
            throw new Error("Post is not found");
        }
        const result = await postServices.getPostByIdFromDB(postId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Post retrived successfully",
            data: result,
        });
    },
);

const updatePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const postId = req.params.postId;
        const isAdmin = req.user?.role === "ADMIN";
        const authorId = req.user?.id;

        if (!postId) {
            throw new Error("Post is not found");
        }

        const result = await postServices.updatePostIntoDB(
            postId as string,
            payload,
            authorId as string,
            isAdmin,
        );
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Post updated successfully",
            data: result,
        });
    },
);

const deletePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId;
        const isAdmin = req.user?.role === "ADMIN";
        const authorId = req.user?.id;

        if (!postId) {
            throw new Error("Post is not found");
        }

        const result = await postServices.deletePostFromDB(
            postId as string,
            isAdmin,
            authorId as string,
        );
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Post deleted successfully",
            data: result,
        });
    },
);

const getPostStats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await postServices.getPostStatsFromDB();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Post stats retrived successfully",
            data: result,
        });
    },
);

const getMyPosts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id;
        const result = await postServices.getMyPostFromDB(authorId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "My Posts retrived successfully",
            data: result,
        });
    },
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
