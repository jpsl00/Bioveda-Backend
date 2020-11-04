import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { EPermissionLevel, User } from "../entity/User";

export class CreateEmployeeUser1604445717135 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.username = "funcionário";
    user.password = "123456";
    user.name = "Amanda Marlon";
    user.hashPassword();
    user.role = EPermissionLevel.Employee;
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
