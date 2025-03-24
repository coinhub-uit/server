import { hash } from 'src/common/utils/hashing';
import { UserEntity } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserEntity, async (faker) => {
  const user = new UserEntity({
    pin: await hash(
      faker.string.numeric({ length: 4, allowLeadingZeros: true }),
    ),
    citizenId: faker.string.numeric({
      length: 12,
      allowLeadingZeros: true,
    }),
    userName: faker.internet.userName(),
    fullName: faker.person.fullName(),
    birthDay: faker.date.birthdate(),
    email: faker.internet.email(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.country()}`,
  });

  return user;
});
