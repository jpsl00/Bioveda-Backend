import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { EPermissionLevel, User } from "../entity/User";

export class CreatePartnerUser1604445734308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.username = "médico";
    user.password = "123456";
    user.name = "Marcelo Furtado";
    user.hashPassword();
    user.role = EPermissionLevel.Partner;
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
