import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController";
import { EPermissionLevel } from "../entity/User";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router.get(
  "/",
  [checkJwt, checkRole(EPermissionLevel.User)],
  AppointmentController.listAll
);

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.User)],
  AppointmentController.getOneById
);

router.post(
  "/",
  [checkJwt, checkRole(EPermissionLevel.User, true)],
  AppointmentController.newAppointment
);

router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.User)],
  AppointmentController.editAppointment
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(EPermissionLevel.User)],
  AppointmentController.deleteAppointment
);

router.post(
  "/:id([0-9]+)/conclude",
  [checkJwt, checkRole(EPermissionLevel.Partner)],
  AppointmentController.concludeAppointment
);

export default router;
