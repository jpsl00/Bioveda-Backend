import { Router } from "express";
import UserController from "../controllers/UserController";
import { EPermissionLevel } from "../entity/User";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all users
router.get(
  "/",
  [checkJwt, checkRole(EPermissionLevel.Employee)],
  UserController.listAll
);

// Get one user
/* router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.Employee)],
  UserController.getOneById
); */

// Get me
router.get("/me", [checkJwt], UserController.getOneById);

//Create a new user
/* router.post(
  "/",
  [checkJwt, checkRole(EPermissionLevel.Employee)],
  UserController.newUser
); */

//Edit one user
/* router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.Employee)],
  UserController.editUser
); */

// Edit me
router.patch("/me", [checkJwt], UserController.editUser);

//Delete one user
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.Employee)],
  UserController.deleteUser
);

export default router;
