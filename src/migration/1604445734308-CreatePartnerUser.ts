import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { EPermissionLevel, User } from "../entity/User";
import { EWorkDays, WorkHour } from "../entity/WorkHour";

export class CreatePartnerUser1604445734308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user1 = new User();
    let user2 = new User();
    user1.username = "médico1";
    user2.username = "médico2";
    user1.password = user2.password = "123456";
    user1.specialty = "especialidade1";
    user2.specialty = "especialidade2";
    user1.name = "Marcelo Furtado";
    user2.name = "Marcos Carreira";

    user1.hashPassword();
    user2.hashPassword();
    user1.role = user2.role = EPermissionLevel.Partner;
    const userRepository = getRepository(User);
    const [savedUser1, savedUser2] = await userRepository.save([user1, user2]);

    let workHour1 = new WorkHour();
    let workHour2 = new WorkHour();
    workHour1.days = workHour2.days = [
      { day: EWorkDays.sun, start: null, end: null },
      { day: EWorkDays.mon, start: 8, end: 17 },
      { day: EWorkDays.tue, start: 8, end: 17 },
      { day: EWorkDays.wed, start: null, end: null },
      { day: EWorkDays.thu, start: 8, end: 17 },
      { day: EWorkDays.fri, start: 8, end: 17 },
      { day: EWorkDays.sat, start: null, end: null },
    ];
    workHour1.user = savedUser1;
    workHour2.user = savedUser2;
    const workHourRepository = getRepository(WorkHour);
    /* const savedWorkHour =  */ await workHourRepository.save([
      workHour1,
      workHour2,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
