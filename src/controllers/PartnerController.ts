import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { EPermissionLevel, User } from "../entity/User";

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
}
