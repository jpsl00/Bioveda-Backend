import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Appointment } from "../entity/Appointment";
import { checkRoleReturn } from "../middlewares/checkRole";
import { EPermissionLevel } from "../entity/User";

export default class AppointmentController {
  static listAll = async (req: Request, res: Response) => {
    const appointmentRepository = getRepository(Appointment);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    let where: Object;
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = {};
        break;
      case EPermissionLevel.Partner:
        where = { partner: userId };
        break;
      case EPermissionLevel.User:
        where = { client: userId };
        break;
    }
    const appointments = await appointmentRepository.find({
      select: ["id", "client", "partner", "comment", "createdAt"],
      where: where,
    });

    res.send(appointments);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const appointmentRepository = getRepository(Appointment);
    let where: Object;
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = {};
        break;
      case EPermissionLevel.Partner:
        where = { partner: userId };
        break;
      case EPermissionLevel.User:
        where = { client: userId };
        break;
    }
    try {
      const appointment = await appointmentRepository.findOneOrFail(id, {
        select: ["id", "client", "partner", "comment", "createdAt"],
        where: where,
      });
      res.send(appointment);
    } catch (error) {
      res.status(404).send("Appointment not found");
    }
  };

  static newAppointment = async (req: Request, res: Response) => {
    let { client, partner, comment, preAppointment } = req.body;
    let appointment = new Appointment();
    appointment.client = client;
    appointment.partner = partner;
    appointment.comment = comment || null;
    appointment.preAppointment = preAppointment;
    appointment.isCanceled = false;

    const errors = await validate(appointment);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const appointmentRepository = getRepository(Appointment);
    try {
      await appointmentRepository.save(appointment);
    } catch (e) {
      console.log(e);
      return res.sendStatus(417);
    }

    res.status(201).send("Appointment created");
  };

  static editAppointment = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const { comment, isCanceled } = req.body;

    const appointmentRepository = getRepository(Appointment);
    let where: Object;
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = {};
        break;
      case EPermissionLevel.Partner:
        where = { partner: userId };
        break;
      case EPermissionLevel.User:
        where = { client: userId };
        break;
    }
    let appointment;
    try {
      appointment = await appointmentRepository.findOneOrFail(id, {
        where: where,
      });
    } catch (error) {
      return res.status(404).send("Appointment not found");
    }

    appointment.comment = comment;
    appointment.isCanceled = isCanceled;
    const errors = await validate(appointment);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await appointmentRepository.save(appointment);
    } catch (error) {
      return res.sendStatus(417);
    }

    res.sendStatus(204);
  };

  static deleteAppointment = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const appointmentRepository = getRepository(Appointment);
    let where: Object;
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = {};
        break;
      case EPermissionLevel.Partner:
        where = { partner: userId };
        break;
      case EPermissionLevel.User:
        where = { client: userId };
        break;
    }
    let appointment;
    try {
      appointment = await appointmentRepository.findOneOrFail(id, {
        where: where,
      });
    } catch (error) {
      return res.status(404).send("Appointment not found");
    }
    appointmentRepository.delete(id);

    res.status(204).send(appointment);
  };
}
