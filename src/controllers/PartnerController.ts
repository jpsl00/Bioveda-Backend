import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { EPermissionLevel, User } from "../entity/User";
import { checkRoleReturn } from "../middlewares/checkRole";
import { PreAppointment } from "../entity/PreAppointment";
import { Appointment } from "../entity/Appointment";

export default class PartnerController {
  static listAll = async (req: Request, res: Response) => {
    // Get Partners from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      where: {
        role: EPermissionLevel.Partner,
      },
      relations: ["workHours", "partnerAppointments"],
    });

    /* console.log(users); */

    res.status(200).send({
      message: "",
      data: [
        ...users.map((user) => ({
          id: user.id,
          field: `${user.name} (${user.specialty})`,
          name: user.name,
          specialty: user.specialty,
          workHours: [...user.workHours.days],
          appointments: [
            ...user.partnerAppointments.map((v) => (v && v.date ? v.date : "")),
          ],
        })),
      ],
    });
  };

  static getOneById = async (req: Request, res: Response) => {
    // Get the ID from the URL
    const id: number = parseInt(req.params.id);

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: id },
      relations: ["workHours", "partnerAppointments"],
    });

    console.log(user);
    if (!user)
      return res.status(404).send({ status: 404, message: "No Partner found" });
    res.status(200).send({
      status: 200,
      message: "",
      data: {
        id: user.id,
        field: `${user.name} (${user.specialty})`,
        name: user.name,
        specialty: user.specialty,
        workHours: [...user.workHours.days],
        appointments: [
          ...user.partnerAppointments.map((v) => (v && v.date ? v.date : "")),
        ],
      },
    });
  };

  static getMyAppointments = async (req: Request, res: Response) => {
    const { id } = await checkRoleReturn(null, res);

    /* const userRepository = getRepository(User);
    const data = await userRepository.findOne({
      relations: ["partnerAppointments", "partnerAppointments.preAppointment"],
      where: {
        id: id,
      },
    }); */

    /* const preAppointmentRepository = getRepository(PreAppointment);
    const data = await preAppointmentRepository.find({
      relations: ["appointments", "appointments.partner", "client"],
      where: {
        "appointments.partner": id,
      },
    }); */

    const appointmentRepository = getRepository(Appointment);
    const data = await appointmentRepository.find({
      relations: ["client"],
      where: { partner: { id: id } },
    });

    if (!data)
      return res
        .status(200)
        .send({ message: "No data", status: 200, data: [] });

    console.log(data);

    res.status(200).send({
      message: "Found data",
      status: 200,
      data: [
        ...data.map((v) => {
          const date = new Date(v.date);
          date.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let type: string = "";
          if (v.completedAt) type = "is-success";
          else if (date.getTime() === today.getTime()) type = "is-warning";
          else if (date.getTime() < today.getTime()) type = "is-danger";
          else type = "is-info";

          return {
            id: v.id,
            comment: v.comment,
            date: v.date,
            completedAt: v.completedAt,
            client: {
              id: v.client.id,
              name: v.client.name,
            },
            type: type,
          };
        }),
      ],
    });
  };
}
