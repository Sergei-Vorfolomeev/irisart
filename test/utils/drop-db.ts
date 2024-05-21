import { DataSource } from 'typeorm'
import { INestApplication } from '@nestjs/common'

export const dropDb = async (app: INestApplication) => {
  const dataSource = await app.resolve(DataSource)

  const tables = await dataSource.query(
    `
          SELECT tablename
          FROM pg_tables
          WHERE schemaname = 'public';
       `,
  )

  for (const table of tables) {
    const tableName = table.tablename
    await dataSource.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`)
  }

  await dataSource.synchronize()
}
