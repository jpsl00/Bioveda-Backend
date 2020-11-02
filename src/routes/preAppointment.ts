import { Router } from "express";
import PreAppointmentController from "../controllers/PreAppointmentController";
import { EPermissionLevel } from "../entity/User";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get(
  "/",
  [checkJwt, checkRole(EPermissionLevel.User)],
  PreAppointmentController.listAll
);

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.User)],
  PreAppointmentController.getOneById
);

router.post(
  "/",
  [checkJwt, checkRole(EPermissionLevel.User, true)],
  PreAppointmentController.newPreAppointment
);

router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.User)],
  PreAppointmentController.editPreAppointment
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.User)],
  PreAppointmentController.deletePreAppointment
);

export default router;
