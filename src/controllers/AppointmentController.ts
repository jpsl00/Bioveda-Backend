import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Appointment } from "../entity/Appointment";
import { checkRoleReturn } from "../middlewares/checkRole";
import { EPermissionLevel } from "../entity/User";
import { type } from "os";

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
      relations: ["partner", "client"],
      where: where,
    });

    res.send([
      ...appointments.map((appointment) => ({
        id: appointment.id,
        client: {
          id: appointment.client.id,
          name: appointment.client.name,
        },
        partner: {
          id: appointment.partner.id,
          name: appointment.partner.name,
          specialty: appointment.partner.specialty,
          address: appointment.partner.address,
        },
        date: appointment.date,
        completedAt: appointment.completedAt,
        comment: appointment.comment,
      })),
    ]);
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
    const data = req.body;
    console.log(data);

    let appointments: Appointment[] = [];
    for (const appointmentData of data) {
      const appointment = new Appointment();
      appointment.client = appointmentData.client;
      appointment.partner = appointmentData.partner;
      appointment.date = appointmentData.date;
      appointment.preAppointment = appointmentData.preAppointment;

      const errors = await validate(appointment);
      if (errors.length > 0) {
        return res.status(400).send(errors);
      }

      appointments.push(appointment);
    }

    const appointmentRepository = getRepository(Appointment);
    let savedAppointments: Appointment[];
    try {
      savedAppointments = await appointmentRepository.save(appointments);
      console.log(data);
    } catch (e) {
      return res.sendStatus(417);
    }

    return res.status(201).send([
      ...(await Promise.all(
        savedAppointments.map(async (savedAppointment: Appointment) => {
          const appointment = await appointmentRepository.findOne(
            savedAppointment.id,
            { relations: ["partner", "client"] }
          );

          const date = new Date(appointment.date);
          date.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let type: string = "";
          if (appointment.completedAt) type = "is-success";
          else if (date.getTime() === today.getTime()) type = "is-warning";
          else if (date.getTime() < today.getTime()) type = "is-danger";
          else type = "is-info";

          return {
            id: appointment.id,
            client: {
              id: appointment.client.id,
              name: appointment.client.name,
            },
            partner: {
              id: appointment.partner.id,
              name: appointment.partner.name,
              specialty: appointment.partner.specialty,
              address: appointment.partner.address,
            },
            date: appointment.date,
            type: type,
          };
        })
      )),
    ]);
    /* let appointment = new Appointment();
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
      return res.sendStatus(417);
    } */

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

  static concludeAppointment = async (req: Request, res: Response) => {
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
    let appointment: Appointment;
    try {
      appointment = await appointmentRepository.findOneOrFail(id, {
        where: where,
        relations: ["client"],
      });
    } catch (error) {
      return res.status(404).send("Appointment not found");
    }

    appointment.comment = comment;
    appointment.completedAt = new Date();
    const errors = await validate(appointment);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    let savedAppointment: Appointment;
    try {
      savedAppointment = await appointmentRepository.save(appointment);
    } catch (error) {
      return res.sendStatus(417);
    }

    res.status(202).send({
      status: 202,
      message: "",
      data: {
        id: savedAppointment.id,
        comment: savedAppointment.comment,
        date: appointment.date,
        completedAt: savedAppointment.completedAt,
        client: {
          id: appointment.client.id,
          name: appointment.client.name,
        },
        type: "is-success",
      },
    });
  };
}
