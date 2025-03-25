import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(TicketEntity, (faker) => {
  return new TicketEntity({
    initMoney: +faker.finance.amount({
      min: 0,
      max: 99999999,
      dec: 0,
    }),
  });
});
