import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RolesEnum } from '../src/common/enums/roles.enum';

/**
 * This migration is meant for testing purposes only. Notice that having
 * hard-coded passwords is a SECURITY RISK.
 */
export class insertTestUsers1668635136437 implements MigrationInterface {
  private usersTable = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await bcrypt.hash(
      '14159265',
      parseInt(process.env.BCRYPT_ROUNDS, 10),
    );

    const queryBuilder = queryRunner.manager.createQueryBuilder();
    queryBuilder
      .insert()
      .into(this.usersTable, ['username', 'password', 'role'])
      .values([
        {
          username: 'Marcus Aurelius',
          password: passwordHash,
          role: RolesEnum.MANAGER,
        },
        {
          username: 'Julius Caesar',
          password: passwordHash,
          role: RolesEnum.TECHNICIAN,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queryBuilder = queryRunner.manager.createQueryBuilder();

    await queryBuilder.delete().from(this.usersTable).execute();
  }
}
