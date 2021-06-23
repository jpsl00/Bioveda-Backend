import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { decodeB64 } from "../util/b64-helper";
import AuthController from "./AuthController";

export default class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "username", "role"], //We dont want to send the passwords on response
    });

    //Send the users object
    res.send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    //const id: number = parseInt(req.params.id);
    const id = res.locals.jwtPayload.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: [
          "id",
          "name",
          "username",
          "telephone",
          "email",
          "address",
          "role",
          "birthdate",
          "workHours",
        ], //We dont want to send the password on response
      });

      res.status(200).send(user);
    } catch (error) {
      res.status(404).send("User not found");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { username, password, role } = req.body;
    let user = new User();
    user.username = username;
    user.password = password;
    user.role = role;

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("username already in use");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send("User created");
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    //const id: number = parseInt(req.params.id);
    const id = res.locals.jwtPayload.id;

    //Get values from the body
    const { email, address, birthdate, telephone, workHours } = JSON.parse(
      decodeB64(req.body.data)
    );

    console.log(JSON.parse(decodeB64(req.body.data)));

    //Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id, {
        relations: ["workHours"],
      });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("User not found");
      return;
    }

    //Validate the new values on model
    user.email = email;
    user.address = address;
    user.birthdate = birthdate;
    user.telephone = telephone;
    if (workHours?.days) user.workHours = workHours.days;
    const errors = await validate(user);
    if (errors.length > 0) {
      console.log(errors);
      return res.status(400).send(errors);
    }

    //Try to save
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).send("Error during save");
    }
    //After all send a 204 (no content, but accepted) response

    /* AuthController.checkActive(req, res); */
    res.status(200).send({ status: 200, message: "OK!" });
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}
