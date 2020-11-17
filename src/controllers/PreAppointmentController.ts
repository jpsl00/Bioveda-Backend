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

    const preAppointments = await createQueryBuilder(PreAppointment, "pa")
      .where(...where)
      .select([
        "pa.id",
        "client.id",
        "client.name",
        "client.email",
        "client.address",
        "client.telephone",
        "pa.personalWeight",
        "pa.personalHeight",
        "pa.personalAge",
        "pa.medicalPulse",
        "pa.medicalLanguage",
        "pa.medicalDosha",
        "pa.medicalRecommendations",
        "pa.complaint",
        "pa.complaintType",
        "appointments",
        "pa.createdAt",
      ])
      .leftJoin("pa.client", "client")
      .leftJoin("pa.appointments", "appointments")
      .getMany();

    const response = preAppointments.map((v) => ({
      id: v.id,
      personal: {
        client: v.client.id,
        name: v.client.name,
        email: v.client.email,
        address: v.client.address,
        telephone: v.client.telephone,
        weight: v.personalWeight,
        height: v.personalHeight,
        age: v.personalAge,
      },
      medical: {
        pulse: v.medicalPulse,
        language: v.medicalLanguage,
        dosha: v.medicalDosha,
        recommendations: v.medicalRecommendations,
      },
      complaint: {
        text: v.complaint,
        type: v.complaintType,
      },
      appointments: v.appointments,
    }));
    /*   preAppointmentRepository.find({
      select: ["id", "client", "comment", "createdAt"],
      relations: ["client"],
      where: where,
    }); */
    res.send(response);
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
    });
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const preAppointmentRepository = getRepository(PreAppointment);
    let where: [string, Object];
    switch (permission) {
      case EPermissionLevel.Admin:
      case EPermissionLevel.Employee:
        where = ["", {}];
        break;
      case EPermissionLevel.Partner:
      case EPermissionLevel.User:
        where = ["client.id = :userId", { userId }];
        break;
    }
    try {
      const preAppointment = await createQueryBuilder(PreAppointment, "pa")
        .where("pa.id = :id", { id: id })
        .andWhere(...where)
        .select([
          "pa.id",
          "client.id",
          "client.name",
          "client.email",
          "client.address",
          "client.telephone",
          "pa.personalWeight",
          "pa.personalHeight",
          "pa.personalAge",
          "pa.medicalPulse",
          "pa.medicalLanguage",
          "pa.medicalDosha",
          "pa.complaint",
          "pa.complaintType",
          "appointments",
          "pa.createdAt",
        ])
        .leftJoin("pa.client", "client")
        .leftJoin("pa.appointments", "appointments")
        .getOne();

      if (!preAppointment) return res.sendStatus(404);
      else {
        return res.status(302).send({
          id: preAppointment.id,
          personal: {
            client: preAppointment.client.id,
            name: preAppointment.client.name,
            email: preAppointment.client.email,
            address: preAppointment.client.address,
            telephone: preAppointment.client.telephone,
            weight: preAppointment.personalWeight,
            height: preAppointment.personalHeight,
            age: preAppointment.personalAge,
          },
          medical: {
            pulse: preAppointment.medicalPulse,
            language: preAppointment.medicalLanguage,
            dosha: preAppointment.medicalDosha,
            recommendations: preAppointment.medicalRecommendations,
          },
          complaint: {
            text: preAppointment.complaint,
            type: preAppointment.complaintType,
          },
          appointments: preAppointment.appointments,
        });
      }
    } catch (error) {
      return res.status(404).send("PreAppointment not found");
    }
  };

  static newPreAppointment = async (req: Request, res: Response) => {
    let { personal, complaint } = req.body;
    console.log(req.body);
    let preAppointment = new PreAppointment();
    // Personal
    preAppointment.client = personal.client;
    preAppointment.personalAge = personal.age;
    preAppointment.personalHeight = personal.height;
    preAppointment.personalWeight = personal.weight;
    // Complaint
    preAppointment.complaint = complaint.text;
    preAppointment.complaintType = complaint.type;
    preAppointment.appointments = [];

    const errors = await validate(preAppointment);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    let newPreAppointment: PreAppointment;
    const preAppointmentRepository = getRepository(PreAppointment);
    try {
      newPreAppointment = await preAppointmentRepository.save(preAppointment);
    } catch (e) {
      return res.sendStatus(417);
    }

    res.status(201).send({
      message: "PreAppointment created",
      data: {
        id: newPreAppointment.id,
        personal: {
          client: newPreAppointment.client.id,
          name: newPreAppointment.client.name,
          email: newPreAppointment.client.email,
          address: newPreAppointment.client.address,
          telephone: newPreAppointment.client.telephone,
          weight: newPreAppointment.personalWeight,
          height: newPreAppointment.personalHeight,
          age: newPreAppointment.personalAge,
        },
        medical: {
          pulse: newPreAppointment.medicalPulse,
          language: newPreAppointment.medicalLanguage,
          dosha: newPreAppointment.medicalDosha,
          recommendations: newPreAppointment.medicalRecommendations,
        },
        complaint: {
          text: newPreAppointment.complaint,
          type: newPreAppointment.complaintType,
        },
        appointments: newPreAppointment.appointments,
      },
    });
  };

  static editPreAppointment = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { permission, id: userId } = await checkRoleReturn(null, res);

    const { medical } = req.body;

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
    let preAppointment: PreAppointment;
    try {
      preAppointment = await preAppointmentRepository.findOneOrFail(id, {
        where: where,
        relations: ["client", "appointments"],
      });
    } catch (error) {
      return res.status(404).send("PreAppointment not found");
    }

    preAppointment.medicalPulse = medical.pulse;
    preAppointment.medicalLanguage = medical.language;
    preAppointment.medicalDosha = medical.dosha;
    preAppointment.medicalRecommendations = medical.recommendations;
    const errors = await validate(preAppointment);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      const updatedRecord = await preAppointmentRepository.save(preAppointment);
      console.log(updatedRecord);
      return res.status(202).send({
        data: {
          id: updatedRecord.id,
          personal: {
            client: updatedRecord.client.id,
            name: updatedRecord.client.name,
            email: updatedRecord.client.email,
            address: updatedRecord.client.address,
            telephone: updatedRecord.client.telephone,
            weight: updatedRecord.personalWeight,
            height: updatedRecord.personalHeight,
            age: updatedRecord.personalAge,
          },
          medical: {
            pulse: updatedRecord.medicalPulse,
            language: updatedRecord.medicalLanguage,
            dosha: updatedRecord.medicalDosha,
            recommendations: updatedRecord.medicalRecommendations,
          },
          complaint: {
            text: updatedRecord.complaint,
            type: updatedRecord.complaintType,
          },
          appointments: updatedRecord.appointments,
        },
      });
    } catch (error) {
      return res.sendStatus(417);
    }
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
