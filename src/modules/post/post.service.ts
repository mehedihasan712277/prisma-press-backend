import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

import { prisma } from "../../lib/prisma";
import {
    ICreatePostPayload,
    IPostQuery,
    IUpdatePostPayload,
} from "./post.interface";

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

const getAllPostFromDB = async (query: IPostQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const andCondition: PostWhereInput[] = [];
    const tags = query.tags ? JSON.parse(query.tags as string) : null;
    const tagsArray = Array.isArray(tags) ? tags : [];

    if (query.searchTerm) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    if (query.title) {
        andCondition.push({
            title: query.title,
        });
    }

    if (query.content) {
        andCondition.push({
            content: query.content,
        });
    }

    if (query.authorId) {
        andCondition.push({
            authorId: query.authorId,
        });
    }

    if (query.isFeatured) {
        andCondition.push({
            isFeatured: Boolean(query.isFeatured),
        });
    }

    if (query.tags) {
        andCondition.push({
            tags: {
                hasSome: tagsArray,
            },
        });
    }

    if (query.status) {
        andCondition.push({
            status: query.status,
        });
    }
    const result = await prisma.post.findMany({
        // -------------------optimized --------------------------
        where: {
            AND: andCondition,
        },

        // -------------------unoptimized --------------------------
        // where: {
        //     AND: [
        //         // searching ob title and content
        //         query.searchTerm
        //             ? {
        //                   OR: [
        //                       {
        //                           title: {
        //                               contains: query.searchTerm,
        //                               mode: "insensitive",
        //                           },
        //                       },
        //                       {
        //                           content: {
        //                               contains: query.searchTerm,
        //                               mode: "insensitive",
        //                           },
        //                       },
        //                   ],
        //               }
        //             : {},
        //         // title filtering
        //         query.title ? { title: query.title } : {},
        //         // content filtering
        //         query.content ? { content: query.content } : {},
        //     ],
        // },

        // pagination
        take: limit,
        skip: skip,
        // sorting
        orderBy: {
            [sortBy]: sortOrder,
        },

        // select: {
        //     title: true,
        //     content: true,
        //     tags: true,
        //     isFeatured: true,
        // },
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
    // -----------------problem simulation why transection is needed------------------
    // const updatedPost = await prisma.post.update({
    //     where: {
    //         id: postId,
    //     },
    //     data: {
    //         views: {
    //             increment: 1,
    //         },
    //     },
    // });

    // // throw new Error("fake error");

    // const result = await prisma.post.findUniqueOrThrow({
    //     where: {
    //         id: postId,
    //     },
    //     include: {
    //         author: {
    //             omit: {
    //                 password: true,
    //             },
    //         },
    //         comments: true,
    //     },
    // });

    // return result;
    // ----------------solving the upper problem using transection----------------------
    const transectionResult = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
        });
        // throw new Error("fake error");
        const post = await tx.post.findUniqueOrThrow({
            where: {
                id: postId,
            },
            include: {
                author: {
                    omit: {
                        password: true,
                    },
                },
                comments: {
                    where: {
                        status: "APPROVED",
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });
        return post;
    });

    return transectionResult;
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

const getPostStatsFromDB = async () => {
    const transectionResult = await prisma.$transaction(async (tx) => {
        // less optimized approach------------------

        // const totalPosts = await tx.post.count();
        // const totalPublishedPosts = await tx.post.count({
        //     where: {
        //         status: PostStatus.PUBLISHED,
        //     },
        // });

        // const totalDraftPosts = await tx.post.count({
        //     where: {
        //         status: PostStatus.DRAFT,
        //     },
        // });
        // const totalArchivedPosts = await tx.post.count({
        //     where: {
        //         status: PostStatus.ARCHIVE,
        //     },
        // });
        // const totalComments = await tx.comment.count();
        // const totalAprovedComments = await tx.comment.count({
        //     where: {
        //         status: CommentStatus.APPROVED,
        //     },
        // });

        // const totalRejectedComments = await tx.comment.count({
        //     where: {
        //         status: CommentStatus.REJECT,
        //     },
        // });

        // // bad approach---------------
        // // const allPosts = await tx.post.findMany();
        // // let totalPostViews = 0;
        // // allPosts.forEach((post) => {
        // //     totalPostViews = totalPostViews + post.views;
        // // });

        // // good approach---------------
        // const totalPostViewsAggregate = await tx.post.aggregate({
        //     _sum: {
        //         views: true,
        //     },
        // });

        // const totalPostViews = totalPostViewsAggregate._sum.views;

        // ============================more optimized approach=======================================
        const [
            totalPosts,
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalComments,
            totalAprovedComments,
            totalRejectedComments,
            totalPostViewsAggregate,
        ] = await Promise.all([
            await tx.post.count(),
            await tx.post.count({
                where: {
                    status: PostStatus.PUBLISHED,
                },
            }),
            await tx.post.count({
                where: {
                    status: PostStatus.DRAFT,
                },
            }),
            await tx.post.count({
                where: {
                    status: PostStatus.ARCHIVE,
                },
            }),
            await tx.comment.count(),
            await tx.comment.count({
                where: {
                    status: CommentStatus.APPROVED,
                },
            }),
            await tx.comment.count({
                where: {
                    status: CommentStatus.REJECT,
                },
            }),
            await tx.post.aggregate({
                _sum: {
                    views: true,
                },
            }),
        ]);

        return {
            totalPosts,
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalComments,
            totalAprovedComments,
            totalRejectedComments,
            totalPostViews: totalPostViewsAggregate._sum.views,
        };
    });
    return transectionResult;
};

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
