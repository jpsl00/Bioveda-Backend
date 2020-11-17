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
      relations: ["workHours"],
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
        })),
      ],
    });
  };
}
