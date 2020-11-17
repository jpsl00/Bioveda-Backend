import { Router } from "express";
import PartnerController from "../controllers/PartnerController";
import { EPermissionLevel } from "../entity/User";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get(
  "/",
  [checkJwt, checkRole(EPermissionLevel.User)],
  PartnerController.listAll
);

/* router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.User)],
  PartnerController.getOneById
); */

export default router;
