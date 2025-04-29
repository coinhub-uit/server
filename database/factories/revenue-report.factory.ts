import { setSeederFactory } from 'typeorm-extension';
import { randomMoney } from 'lib/random-money';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';

export default setSeederFactory(RevenueReportEntity, () => {
  const revenueReport = new RevenueReportEntity();
  revenueReport.income = randomMoney({ min: 2000000 });
  revenueReport.expense = randomMoney({ min: revenueReport.income.toNumber() });
  revenueReport.netIncome = revenueReport.expense.minus(revenueReport.income);
  return revenueReport;
});
