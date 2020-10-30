/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as PreAppointmentService from "./preAppointment.service";
import { PreAppointment } from "./preAppointment.interface";

import { checkJwt } from "../../middleware/authz.middleware";
import { PreAppointmentPermissions } from "./preAppointment.permissions";
import { checkPermissions } from "../../middleware/permissions.middleware";

/**
 * Router Definition
 */

export const appointmentsRouter = express.Router();

/**
 * Controller Definitions
 */

// Middleware
appointmentsRouter.use(checkJwt);

// GET PreAppointments/

appointmentsRouter.get(
  "/",
  [
    checkPermissions(
      [
        PreAppointmentPermissions.ReadPreAppointments,
        PreAppointmentPermissions.ReadSelfPreAppointments,
      ],
      { checkAllScopes: false }
    ),
  ],
  async (req: Request, res: Response) => {
    try {
      const appointments: PreAppointment[] = await PreAppointmentService.findAll();

      res.status(200).send(appointments);
    } catch (e) {
      res.status(404).send(e.message);
    }
  }
);

// POST PreAppointments/

appointmentsRouter.post(
  "/",
  [
    checkPermissions(
      [
        PreAppointmentPermissions.CreatePreAppointments,
        PreAppointmentPermissions.CreateSelfPreAppointments,
      ],
      { checkAllScopes: false }
    ),
  ],
  async (req: Request, res: Response) => {
    try {
      const preAppointment: PreAppointment = req.body.appointment;

      await PreAppointmentService.create(preAppointment);

      res.sendStatus(201);
    } catch (e) {
      res.status(404).send(e.message);
    }
  }
);

// GET PreAppointments/:id

appointmentsRouter.get(
  "/:id",
  [
    checkPermissions(
      [
        PreAppointmentPermissions.ReadPreAppointments,
        PreAppointmentPermissions.ReadSelfPreAppointments,
      ],
      { checkAllScopes: false }
    ),
  ],
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
      const appointment: Partial<PreAppointment> = await PreAppointmentService.find(
        id
      );

      res.status(200).send(appointment);
    } catch (e) {
      res.status(404).send(e.message);
    }
  }
);

// PUT PreAppointments/

appointmentsRouter.put(
  "/:id",
  [
    checkPermissions(
      [
        PreAppointmentPermissions.UpdatePreAppointments,
        PreAppointmentPermissions.UpdateSelfPreAppointments,
      ],
      { checkAllScopes: false }
    ),
  ],
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
      const appointment: PreAppointment = req.body.appointment;

      await PreAppointmentService.update(id, appointment);

      res.sendStatus(200);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// DELETE PreAppointments/:id

appointmentsRouter.delete(
  "/:id",
  [
    checkPermissions(
      [
        PreAppointmentPermissions.DeletePreAppointments,
        PreAppointmentPermissions.DeleteSelfPreAppointments,
      ],
      { checkAllScopes: false }
    ),
  ],
  async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await PreAppointmentService.remove(id);

      res.sendStatus(200);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);
