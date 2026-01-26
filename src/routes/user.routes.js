import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()
//// http://localhost:8080/api/v1users/register
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

export default router