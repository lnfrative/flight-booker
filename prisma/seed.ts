import { faker } from '@faker-js/faker';
import { prisma } from '../db';
import { hash } from 'argon2';
import { createAccessToken } from '../auth';
import { RESERVATION_CANCELLED_STATUS_ID, RESERVATION_CONFIRMED_STATUS_ID, RESERVATION_CREATED_STATUS_ID } from '../constants';

const AIRPLANE_SIZE = 10;
const AIRPORT_SIZE = 10;

async function main() {
  console.log('\nSeeding database...');

  console.log('\nCreating reservation statuses...');
  const reservationStatuses = await Promise.all([
    prisma.reservationStatus.create({
      data: { name: 'RESERVADO', id: RESERVATION_CREATED_STATUS_ID },
    }),
    prisma.reservationStatus.create({
      data: { name: 'CONFIRMADO', id: RESERVATION_CONFIRMED_STATUS_ID },
    }),
    prisma.reservationStatus.create({
      data: { name: 'CANCELADO', id: RESERVATION_CANCELLED_STATUS_ID },
    }),
  ]);

  console.log('\nCreating airplane models...');
  const airplaneModels = generateUniqueAirplaneModels();
  const airplanes = await Promise.all(
    Array.from({ length: AIRPLANE_SIZE }).map((value, idx) =>
      prisma.airplane.create({
        data: {
          model: airplaneModels[idx],
          capacity: faker.number.int({ min: 100, max: 300 }),
          stock: faker.number.int({ min: 1, max: 10 }),
        },
      })
    )
  );

  console.log('\nCreating airports...');
  const airportsData = generateUniqueAirports();
  const airports = await Promise.all(
    Array.from({ length: AIRPORT_SIZE }).map((value, idx) => {
      const airport = airportsData[idx];
      return prisma.airport.create({
        data: {
          name: airport.name,
          iataCode: airport.iataCode,
        },
      })
    })
  );

  console.log('\nCreating flights...');
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

  if (process.env.NODE_ENV === 'development') {
    console.log('\nDevelopment environment detected, creating a test user...');

    const user = await prisma.user.create({
      data: {
        name: 'johndoe',
        email: 'johndoe@example.com',
        password: await hash('randompassword'),
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

    console.log('\nUser id:', user.id);
    console.log('User email:', user.email);
    console.log('User password:', 'randompassword');

    console.log('\nTemporary access_token:', await createAccessToken(user));
  }

  console.log('\nDatabase seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  const generateUniqueAirplaneModels = () => {
    const uniqueAirplanes = new Set<string>();
    
    while (uniqueAirplanes.size < AIRPLANE_SIZE) {
      uniqueAirplanes.add(faker.airline.airplane().name);
    }
  
    return Array.from(uniqueAirplanes);
  }

  const generateUniqueAirports = () => {
    const uniqueAirports = new Set<string>();  
    const airports = []; 
    
    while (airports.length < AIRPORT_SIZE) {
      const airport = faker.airline.airport();
      
      if (!uniqueAirports.has(airport.iataCode)) {
        uniqueAirports.add(airport.iataCode);
        airports.push(airport);
      }
    }
  
    return airports;
  }