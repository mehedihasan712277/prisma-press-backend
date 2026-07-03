import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        const user = await userService.createUserIntoDB(payload);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user registered successfully",
            data: { user },
        });
    },
);

const getMyProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const profile = await userService.getMyProfileFromDB(
            req.user?.id as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User profile fetched successfully",
            data: { profile },
        });
    },
);

const updateMyprofile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.user?.id as string;
        const payload = req.body;

        const updatedUser = await userService.updateMyprofileInDB(id, payload);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User profile updated successfully",
            data: { updatedUser },
        });
    },
);

export const userController = { registerUser, getMyProfile, updateMyprofile };
