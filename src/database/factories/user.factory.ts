import { UserEntity } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { randomUUID } from 'crypto';

export default setSeederFactory(UserEntity, (faker) => {
  return new UserEntity({
    id: randomUUID(),
    citizenId: faker.string.numeric({
      length: 12,
      allowLeadingZeros: true,
    }),
    fullname: faker.person.fullName(),
    birthDate: faker.date.birthdate(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.country()}`,
    avatar: faker.datatype.boolean() ? faker.image.avatar() : undefined,
  });
});
