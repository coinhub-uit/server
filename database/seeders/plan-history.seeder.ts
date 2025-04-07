import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';

export default class PlanHistorySeeder implements Seeder {
  private DATE_NOW = Object.freeze(new Date());

  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(PlanHistoryEntity);

    const planHistories = repository.create([
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 25),
        ),
        plan: { id: 1 },
        rate: 1,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 25),
        ),
        plan: { id: 2 },
        rate: 1.8,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 25),
        ),
        plan: { id: 3 },
        rate: 1.8,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 25),
        ),
        plan: { id: 4 },
        rate: 1.8,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 18),
        ),
        plan: { id: 1 },
        rate: 2,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 18),
        ),
        plan: { id: 2 },
        rate: 3,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 18),
        ),
        plan: { id: 3 },
        rate: 3.2,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 18),
        ),
        plan: { id: 4 },
        rate: 3.2,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 17),
        ),
        plan: { id: 2 },
        rate: 4,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 15),
        ),
        plan: { id: 3 },
        rate: 4,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 15),
        ),
        plan: { id: 4 },
        rate: 4,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 15),
        ),
        plan: { id: 1 },
        rate: 1,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 14),
        ),
        plan: { id: 2 },
        rate: 2.3,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 13),
        ),
        plan: { id: 3 },
        rate: 2.4,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 13),
        ),
        plan: { id: 4 },
        rate: 2.4,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 12),
        ),
        plan: { id: 1 },
        rate: 1,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 12),
        ),
        plan: { id: 2 },
        rate: 1,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 12),
        ),
        plan: { id: 3 },
        rate: 3,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 12),
        ),
        plan: { id: 4 },
        rate: 3,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 10),
        ),
        plan: { id: 2 },
        rate: 0.8,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 10),
        ),
        plan: { id: 3 },
        rate: 3.2,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 10),
        ),
        plan: { id: 4 },
        rate: 3.4,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 9),
        ),
        plan: { id: 2 },
        rate: 1.2,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 7),
        ),
        plan: { id: 2 },
        rate: 2,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 7),
        ),
        plan: { id: 3 },
        rate: 5,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 7),
        ),
        plan: { id: 4 },
        rate: 5.2,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 5),
        ),
        plan: { id: 2 },
        rate: 1,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 5),
        ),
        plan: { id: 3 },
        rate: 2.9,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 5),
        ),
        plan: { id: 4 },
        rate: 2.8,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 2),
        ),
        plan: { id: 2 },
        rate: 1.8,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 2),
        ),
        plan: { id: 3 },
        rate: 4,
      },
      {
        createdAt: new Date(
          new Date(this.DATE_NOW).setMonth(this.DATE_NOW.getMonth() - 2),
        ),
        plan: { id: 4 },
        rate: 4,
      },
    ]);

    await repository.insert(planHistories);
  }
}
