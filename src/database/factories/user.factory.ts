import { hash } from 'src/common/utils/hashing';
import { UserEntity } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

async function getAvatarBytes() {
  const avatarUrl = faker.image.avatar(); // Get a random avatar URL
  const response = await fetch(avatarUrl);
  const buffer = await response.arrayBuffer(); // Convert to bytes
  return Buffer.from(buffer);
}

export default setSeederFactory(UserEntity, async (faker) => {
  return new UserEntity({
    id: randomUUID(),
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
    avatar: faker.datatype.boolean() ? await getAvatarBytes() : undefined,
  });
});
