import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  let token = <string>req.headers["authorization"] || "";
  token = token.replace(/(Bearer )/, "");
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    console.log(jwtPayload);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    return res.status(401).send({ error });
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  /* const { id, username, email, role } = jwtPayload;
  const newToken = jwt.sign({ id, username, email, role }, config.jwtSecret, {
    expiresIn: "30m",
  });
  res.setHeader("token", newToken); */

  //Call the next middleware or controller
  next();
};
