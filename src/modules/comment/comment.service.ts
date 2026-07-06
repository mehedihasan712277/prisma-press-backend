import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";

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

const getCommentByAuthorIdFromDB = async () => {};

const getCommentbyCommentIdFromDB = async () => {};

const updateCommentInDB = async () => {};

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
