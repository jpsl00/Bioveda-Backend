import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
//router.post("/change-password", [checkJwt], AuthController.changePassword);

//Check Token Validity
router.post("/check", AuthController.checkActive);

export default router;
