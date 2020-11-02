import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User, EPermissionLevel } from "../entity/User";

export const checkRole = (role: EPermissionLevel, exact: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      return res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    if (exact ? user.role === role : user.role >= role) next();
    else res.status(401).send();
  };
};

export const checkRoleReturn = async (
  id?: number,
  res?: Response
): Promise<{ permission: EPermissionLevel; id: number }> => {
  if (!id && !res) return { permission: EPermissionLevel.Invalid, id: null };
  if (!id) id = res.locals.jwtPayload.userId;

  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (id) {
    return { permission: EPermissionLevel.Invalid, id: user.id };
  }

  return { permission: user.role, id: user.id };
};
