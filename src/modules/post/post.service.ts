import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

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

const getPostByIdFromDB = async (postId: string) => {
    // const result = await prisma.post.findUniqueOrThrow({
    //     where: {
    //         id: postId,
    //     },
    // });
    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            views: {
                increment: 1,
            },
        },
        include: {
            author: {
                omit: {
                    password: true,
                },
            },
            comments: true,
        },
    });

    return updatedPost;
};

const updatePostIntoDB = async (
    postId: string,
    payload: IUpdatePostPayload,
    authorId: string,
    isAdmin: boolean,
) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You dont have access to update the post");
    }
    const result = await prisma.post.update({
        where: {
            id: postId,
        },
        data: payload,
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

const deletePostFromDB = async (
    postId: string,
    isAdmin: boolean,
    authorId: string,
) => {
    const post = await prisma.post.findFirstOrThrow({
        where: {
            id: postId,
        },
    });
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You dont have access to update the post");
    }
    await prisma.post.delete({
        where: {
            id: postId,
        },
    });

    return null;
};

const getPostStatsFromDB = async () => {};

const getMyPostFromDB = async (authorId: string) => {
    const result = await prisma.post.findMany({
        where: {
            authorId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true,
                },
            },
            _count: {
                select: {
                    comments: true,
                },
            },
        },
    });

    return result;
};

export const postServices = {
    createPostIntoDB,
    getAllPostFromDB,
    getPostByIdFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    getPostStatsFromDB,
    getMyPostFromDB,
};
