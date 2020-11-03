import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { EPermissionLevel, User } from "../entity/User";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.username = "admin";
    user.password = "admin";
    user.name = "Admin";
    user.hashPassword();
    user.role = EPermissionLevel.Admin;
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
