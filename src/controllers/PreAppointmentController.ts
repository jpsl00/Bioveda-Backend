import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { validate } from "class-validator";

import { PreAppointment } from "../entity/PreAppointment";
import { checkRoleReturn } from "../middlewares/checkRole";
import { EPermissionLevel } from "../entity/User";

export default class PreAppointmentController {
  static listAll = async (req: Request, res: Response) => {
    const { permission, id: userId } = await checkRoleReturn(null, res);

    let where: [string, Object];
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = ["", {}];
        break;
      case EPermissionLevel.Partner:
      case EPermissionLevel.User:
        where = ["client.id = :id", { id: userId }];
        break;
    }

    const { page, limit } = req.query;
    const preAppointments = await createQueryBuilder(PreAppointment, "pa")
      .where(...where)
      .select([
        "pa.id",
        "client.id",
        "client.name",
        "pa.comment",
        "appoi",
        "pa.createdAt",
      ])
      .leftJoin("pa.client", "client")
      .leftJoin("pa.appointments", "appoi")
      .offset(
        (parseInt((page as string) || "0") - 1) *
          parseInt((limit as string) || "3")
      )
      .limit(parseInt((limit as string) || "3"))
      .getMany();

    /*   preAppointmentRepository.find({
      select: ["id", "client", "comment", "createdAt"],
      relations: ["client"],
      where: where,
    }); */

    res.send(preAppointments);
  };

  static countAll = async (req: Request, res: Response) => {
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

    const count = await preAppointmentRepository.count({ where: where });

    res.send({
      total: count,
      where,
      fuck_this_bullshit: {
        id: res.locals.jwtPayload.userId,
        role: permission,
      },
    });
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
    preAppointment.isCanceled = false;
    preAppointment.appointments = [];
    console.log(preAppointment);

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
