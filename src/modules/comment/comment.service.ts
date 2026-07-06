import { prisma } from "../../lib/prisma";
import {
    ICreateCommentPayload,
    IUpdateCommentPayload,
} from "./comment.interface";

const createCommentIntoDB = async (
    payload: ICreateCommentPayload,
    authorId: string,
) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId,
        },
    });

    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId,
        },
    });
    return comment;
};

const getCommentByAuthorIdFromDB = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            authorId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            post: {
                select: {
                    title: true,
                    id: true,
                },
            },
        },
    });

    return comments;
};

const getCommentbyCommentIdFromDB = async (commentId: string) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                },
            },
        },
    });
    return comment;
};

const updateCommentInDB = async (
    commentId: string,
    data: IUpdateCommentPayload,
    authorId: string,
) => {
    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId,
        },
    });
    const comment = await prisma.comment.update({
        where: {
            id: commentId,
            authorId,
        },
        data,
    });
    return comment;
};

const deleteCommentFromDB = async () => {};

const moderateCommentInDB = async () => {};

export const commentService = {
    createCommentIntoDB,
    getCommentByAuthorIdFromDB,
    getCommentbyCommentIdFromDB,
    updateCommentInDB,
    deleteCommentFromDB,
    moderateCommentInDB,
};
