import { setSeederFactory } from 'typeorm-extension';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';

export default setSeederFactory(TicketReportEntity, (faker) => {
  const ticketReport = new TicketReportEntity();
  ticketReport.openedCount = faker.number.int({ min: 5, max: 30 });
  ticketReport.closedCount = faker.number.int({ min: 5, max: 30 });
  return ticketReport;
});
