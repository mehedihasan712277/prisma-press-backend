import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostIntoDB = async (
    payload: ICreatePostPayload,
    userId: string,
) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId,
        },
    });

    return result;
};

const getAllPostFromDB = async () => {
    const result = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true,
                },
            },
            comments: true,
        },
    });
    return result;
};

const getPostByIdFromDB = () => {};

const updatePostIntoDB = () => {};

const deletePostFromDB = () => {};

const getPostStatsFromDB = () => {};

const getMyPostFromDB = () => {};

export const postServices = {
    createPostIntoDB,
    getAllPostFromDB,
    getPostByIdFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    getPostStatsFromDB,
    getMyPostFromDB,
};
