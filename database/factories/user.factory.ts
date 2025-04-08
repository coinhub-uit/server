import { UserEntity } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { randomUUID } from 'crypto';

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();
  user.id = randomUUID();
  user.citizenId = faker.string.numeric({
    length: 12,
    allowLeadingZeros: true,
  });
  user.fullname = faker.person.fullName();
  user.birthDate = faker.date.birthdate();
  user.address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.country()}`;
  user.avatar = faker.datatype.boolean() ? faker.image.avatar() : null;
  user.createdAt = faker.date.past({ years: 2 });
  return user;
});
