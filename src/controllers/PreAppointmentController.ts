import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { PreAppointment } from "../entity/PreAppointment";
import { checkRoleReturn } from "../middlewares/checkRole";
import { EPermissionLevel } from "../entity/User";

export default class PreAppointmentController {
  static listAll = async (req: Request, res: Response) => {
    const preAppointmentRepository = getRepository(PreAppointment);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    let where: Object;
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = {};
        break;
      case EPermissionLevel.Partner:
      case EPermissionLevel.User:
        where = { client: userId };
        break;
    }
    const preAppointments = await preAppointmentRepository.find({
      select: ["id", "client", "comment", "createdAt"],
      where: where,
    });

    res.send(preAppointments);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const preAppointmentRepository = getRepository(PreAppointment);
    let where: Object;
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = {};
        break;
      case EPermissionLevel.Partner:
      case EPermissionLevel.User:
        where = { client: userId };
        break;
    }
    try {
      const preAppointment = await preAppointmentRepository.findOneOrFail(id, {
        select: ["id", "client", "comment", "createdAt"],
        where: where,
      });
      res.send(preAppointment);
    } catch (error) {
      res.status(404).send("PreAppointment not found");
    }
  };

  static newPreAppointment = async (req: Request, res: Response) => {
    let { client, comment } = req.body;
    let preAppointment = new PreAppointment();
    preAppointment.client = client;
    preAppointment.comment = comment;

    const errors = await validate(preAppointment);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const preAppointmentRepository = getRepository(PreAppointment);
    try {
      await preAppointmentRepository.save(preAppointment);
    } catch (e) {
      return res.sendStatus(417);
    }

    res.status(201).send("PreAppointment created");
  };

  static editPreAppointment = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const { comment, isCanceled } = req.body;

    const preAppointmentRepository = getRepository(PreAppointment);
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
    let preAppointment;
    try {
      preAppointment = await preAppointmentRepository.findOneOrFail(id, {
        where: where,
      });
    } catch (error) {
      return res.status(404).send("PreAppointment not found");
    }

    preAppointment.comment = comment;
    preAppointment.isCanceled = isCanceled;
    const errors = await validate(preAppointment);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await preAppointmentRepository.save(preAppointment);
    } catch (error) {
      return res.sendStatus(417);
    }

    res.sendStatus(204);
  };

  static deletePreAppointment = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const preAppointmentRepository = getRepository(PreAppointment);
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
    let preAppointment;
    try {
      preAppointment = await preAppointmentRepository.findOneOrFail(id, {
        where: where,
      });
    } catch (error) {
      return res.status(404).send("PreAppointment not found");
    }
    preAppointmentRepository.delete(id);

    res.sendStatus(204);
  };
}
