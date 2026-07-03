import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        const { accessToke, refreshToke } =
            await authService.loginUser(payload);

        res.cookie("accessToke", accessToke, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.cookie("refreshToken", refreshToke, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user logged in successfully",
            data: { accessToke, refreshToke },
        });
    },
);

export const authController = { loginUser };
