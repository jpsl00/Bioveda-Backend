/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as AppointmentService from "./appointment.service";
import { Appointment } from "./appointment.interface";
import { Appointments } from "./appointments.interface";

/**
 * Router Definition
 */

export const appointmentsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET Appointments/

appointmentsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const appointments: Appointments = await AppointmentService.findAll();

    res.status(200).send(appointments);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// GET Appointments/:id

appointmentsRouter.get("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const appointment: Appointment = await AppointmentService.find(id);

    res.status(200).send(appointment);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// POST Appointments/

appointmentsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const appointment: Appointment = req.body.appointment;

    await AppointmentService.create(appointment);

    res.sendStatus(201);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// PUT Appointments/

appointmentsRouter.put("/", async (req: Request, res: Response) => {
  try {
    const appointment: Appointment = req.body.appointment;

    await AppointmentService.update(appointment);

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// DELETE Appointments/:id

appointmentsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await AppointmentService.remove(id);

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
