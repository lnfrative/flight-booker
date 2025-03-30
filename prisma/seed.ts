import { faker } from '@faker-js/faker';
import { prisma } from '../db';

async function main() {
  const reservationStatuses = await Promise.all([
    prisma.reservationStatus.create({
      data: { name: 'Reservado' },
    }),
    prisma.reservationStatus.create({
      data: { name: 'Confirmado' },
    }),
    prisma.reservationStatus.create({
      data: { name: 'Cancelado' },
    }),
  ]);

  const airplanes = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.airplane.create({
        data: {
          model: faker.airline.airplane().name,
          capacity: faker.number.int({ min: 100, max: 300 }),
          stock: faker.number.int({ min: 1, max: 10 }),
        },
      })
    )
  );

  const airports = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      const airport = faker.airline.airport();
      return prisma.airport.create({
        data: {
          name: airport.name,
          iataCode: airport.iataCode,
          icaoCode: '',
        },
      })
    })
  );

  const flights = await Promise.all(
    Array.from({ length: 5 }).map(() => {
      const airplane = faker.helpers.arrayElement(airplanes);
      const [origin, destination] = faker.helpers.arrayElements(airports, 2);
      

      return prisma.flight.create({
        data: {
          availableCapacity: faker.number.int({ min: airplane.capacity - 100, max: airplane.capacity }),
          departure: faker.date.soon(),
          originId: origin.id,
          destinationId: destination.id,
          airplaneId: airplane.id,
        },
      })
    }
    )
  );

  const user = await prisma.user.create({
    data: {
      name: 'johndoe',
      email: 'johndoe@example.com',
      password: 'randompassword',
    },
  });

  const reservations = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.reservation.create({
        data: {
          userId: user.id,
          seatCount: faker.number.int({ min: 1, max: 4 }),
          statusId: faker.helpers.arrayElement(reservationStatuses).id,
          flightId: faker.helpers.arrayElement(flights).id,
        },
      })
    )
  );

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
