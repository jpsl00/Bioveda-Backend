import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { EPermissionLevel, User } from "../entity/User";

export class CreateUser1604445741125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = getRepository(User);

    let user1 = new User();
    user1.username = "cliente1";
    user1.password = "123456";
    user1.name = "Carlos Hideo Arima";
    user1.birthdate = new Date(1954, 8, 30);
    user1.hashPassword();
    user1.role = EPermissionLevel.User;

    let user2 = new User();
    user2.username = "cliente2";
    user2.password = "123456";
    user2.name = "José Paulo Ciscato";
    user2.birthdate = new Date(1957, 7, 25);
    user2.hashPassword();
    user2.role = EPermissionLevel.User;

    await userRepository.save([user1, user2]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
