import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";
import { decodeB64 } from "../util/b64-helper";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    const { data } = req.body;
    let { username, password } = JSON.parse(decodeB64(data));

    if (!(username && password)) {
      return res.status(400).send();
    }

    username = decodeB64(username);
    password = decodeB64(password);

    if (!(username && password)) {
      return res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { username },
        relations: ["workHours"],
      });
    } catch (error) {
      return res.status(401).send();
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(401).send();
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address,
        role: user.role,
        birthdate: user.birthdate,
        telephone: user.telephone,
        workHours: user.workHours,
      },
      config.jwtSecret,
      { expiresIn: "15m" }
    );

    //Send the jwt in the response
    res.send({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address,
        role: user.role,
        birthdate: user.birthdate,
        telephone: user.telephone,
        workHours: user.workHours,
      },
      token,
    });
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.id;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
      return;
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };

  static checkActive = async (req: Request, res: Response) => {
    // Get JWT
    const token = req.headers["authorization"];
    let jwtPayload;

    try {
      jwtPayload = <any>jwt.verify(token, config.jwtSecret);
      res.locals.jwtPayload = jwtPayload;
    } catch (e) {
      return res.status(401).send({
        status: 401,
        message: "Invalid Token",
      });
    }

    //Get ID from JWT
    const { id } = res.locals.jwtPayload;
    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { id: id },
        relations: ["workHours"],
      });
    } catch (error) {
      return res.status(401).send();
    }

    //Sign JWT, valid for 1 hour
    const newToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address,
        role: user.role,
        birthdate: user.birthdate,
        telephone: user.telephone,
        workHours: user.workHours,
      },
      config.jwtSecret,
      { expiresIn: "15m" }
    );

    return res.status(200).send({
      status: 200,
      message: "Valid Token",
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          address: user.address,
          role: user.role,
          birthdate: user.birthdate,
          telephone: user.telephone,
          workHours: user.workHours,
        },
        token: newToken,
      },
    });
  };
}
export default AuthController;
