import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateSurveysUsers1614304376520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'surveys_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'survey_id',
            type: 'uuid',
          },
          {
            name: 'value',
            type: 'number',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    )

    await queryRunner.createForeignKey(
      'surveys_users',
      new TableForeignKey({
        name: 'FKUser',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        columnNames: ['user_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'surveys_users',
      new TableForeignKey({
        name: 'FKSurvey',
        referencedTableName: 'surveys',
        referencedColumnNames: ['id'],
        columnNames: ['survey_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('surveys_users', 'FKSurvey')

    await queryRunner.dropForeignKey('surveys_users', 'FKUser')

    await queryRunner.dropTable('surveys_users')
  }
}
