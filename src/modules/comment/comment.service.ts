import { prisma } from "../../lib/prisma";
import {
    ICreateCommentPayload,
    IModerateCommentPayload,
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

const deleteCommentFromDB = async (commentId: string, authorId: string) => {
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId,
            authorId,
        },
    });
    if (!comment) {
        throw new Error("You cannot delete the comment");
    }
    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId,
            authorId,
        },
    });
    return deletedComment;
};

const moderateCommentInDB = async (
    commentId: string,
    payload: IModerateCommentPayload,
) => {
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId,
        },
    });
    if (!comment) {
        throw new Error("Comment is not found");
    }

    if (comment.status === payload.status) {
        throw new Error("Already up to date");
    }
    const moderatedComment = await prisma.comment.update({
        where: {
            id: commentId,
        },
        data: payload,
    });
    return moderatedComment;
};

export const commentService = {
    createCommentIntoDB,
    getCommentByAuthorIdFromDB,
    getCommentbyCommentIdFromDB,
    updateCommentInDB,
    deleteCommentFromDB,
    moderateCommentInDB,
};
