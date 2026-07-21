import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import * as path from 'path';
import { Tour } from './modules/tours/entities/tour.entity';
import { User } from './modules/users/entities/user.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { Passenger } from './modules/bookings/entities/passenger.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { TourView } from './modules/dashboard/entities/tour-view.entity';
import { ItineraryItem } from './modules/tours/entities/itinerary-item.entity';
import { TourMedia } from './modules/tours/entities/tour-media.entity';
import { BookingStatus, PaymentStatus, TourStatus } from './common/constants';

config({ path: path.join(__dirname, '..', '.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nicat',
  synchronize: true,
  entities: [Tour, User, Booking, Passenger, Payment, TourView, ItineraryItem, TourMedia],
});

const sources = ['search', 'direct', 'chat', 'social', 'email', 'referral'];
const devices = ['desktop', 'mobile', 'tablet'];
const countries = ['United States', 'Germany', 'United Kingdom', 'France', 'Turkey', 'Russia', 'Japan', 'Brazil', 'India', 'Canada', 'Australia', 'Italy', 'Spain', 'Netherlands', 'South Korea'];
const guestNames = [
  { first: 'John', last: 'Smith' }, { first: 'Emma', last: 'Johnson' },
  { first: 'Ahmet', last: 'Yılmaz' }, { first: 'Yuki', last: 'Tanaka' },
  { first: 'Maria', last: 'Silva' }, { first: 'Hans', last: 'Mueller' },
  { first: 'Pierre', last: 'Dupont' }, { first: 'Иван', last: 'Петров' },
  { first: 'Olga', last: 'Sidorova' }, { first: 'Alex', last: 'Brown' },
  { first: 'Sarah', last: 'Davis' }, { first: 'Chen', last: 'Wei' },
  { first: 'Priya', last: 'Sharma' }, { first: 'Lucas', last: 'Müller' },
  { first: 'Anna', last: 'Kowalski' }, { first: 'Marco', last: 'Rossi' },
  { first: 'Fatima', last: 'Al-Hassan' }, { first: 'Carlos', last: 'Garcia' },
  { first: 'Sophie', last: 'Martin' }, { first: 'David', last: 'Wilson' },
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRef(): string {
  return `NC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for analytics seeding');

    const tourRepo = AppDataSource.getRepository(Tour);
    const userRepo = AppDataSource.getRepository(User);
    const bookingRepo = AppDataSource.getRepository(Booking);
    const passengerRepo = AppDataSource.getRepository(Passenger);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const viewRepo = AppDataSource.getRepository(TourView);

    const host = await userRepo.findOne({ where: { email: 'admin@nicat.com' } });
    if (!host) {
      console.log('Host user not found. Please register first.');
      await AppDataSource.destroy();
      process.exit(1);
    }

    const tours = await tourRepo.find({ where: { hostId: host.id, status: TourStatus.ACTIVE } });
    if (tours.length === 0) {
      console.log('No active tours found. Run seed-tours first.');
      await AppDataSource.destroy();
      process.exit(1);
    }
    console.log(`Found ${tours.length} active tours`);

    const startDate = new Date('2026-01-01');
    const endDate = new Date('2026-07-21');

    // Find or create test users
    const testUsers: User[] = [];
    for (const g of guestNames) {
      let user = await userRepo.findOne({ where: { email: `${g.first.toLowerCase()}.${g.last.toLowerCase()}@test.com` } });
      if (!user) {
        user = userRepo.create({
          email: `${g.first.toLowerCase()}.${g.last.toLowerCase()}@test.com`,
          firstName: g.first,
          lastName: g.last,
          password: 'hashed_password_placeholder',
          role: 'traveler' as any,
        });
        user = await userRepo.save(user);
      }
      testUsers.push(user);
    }
    console.log(`Found/created ${testUsers.length} test users`);

    // 1. Generate Tour Views
    console.log('\n--- Generating Tour Views ---');
    let viewCount = 0;
    for (const tour of tours) {
      // Each tour gets 50-200 views over 7 months
      const numViews = randomInt(50, 200);
      for (let i = 0; i < numViews; i++) {
        const viewDate = randomDate(startDate, endDate);
        const user = Math.random() > 0.3 ? randomChoice(testUsers) : null;
        const view = viewRepo.create({
          tourId: tour.id,
          userId: user?.id || undefined,
          source: randomChoice(sources),
          deviceType: randomChoice(devices),
          country: randomChoice(countries),
          referrerUrl: Math.random() > 0.5 ? `https://${randomChoice(['google.com', 'instagram.com', 'facebook.com', 'tripadvisor.com'])}` : undefined,
          sessionDuration: randomInt(5, 300),
          viewedAt: viewDate,
        });
        await viewRepo.save(view);
        viewCount++;
      }
    }
    console.log(`✓ Created ${viewCount} tour views`);

    // 2. Generate Bookings & Payments
    console.log('\n--- Generating Bookings & Payments ---');
    let bookingCount = 0;
    let paymentCount = 0;

    for (const tour of tours) {
      // Each tour gets 3-15 bookings over 7 months
      const numBookings = randomInt(3, 15);

      for (let i = 0; i < numBookings; i++) {
        const bookingDate = randomDate(startDate, endDate);
        const user = randomChoice(testUsers);
        const passengers = randomInt(1, 4);
        const basePrice = Number(tour.basePrice);
        const commissionRate = Number(tour.commissionRate) || 15;
        const totalBasePrice = basePrice * passengers;
        const commissionAmount = totalBasePrice * (commissionRate / 100);
        const totalPrice = totalBasePrice;

        // Distribute statuses realistically: 10% cancelled, 15% pending, 25% confirmed, 30% paid, 20% completed
        const statusRoll = Math.random();
        let status: BookingStatus;
        let paymentStatus: PaymentStatus | null = null;
        if (statusRoll < 0.10) status = BookingStatus.CANCELLED;
        else if (statusRoll < 0.25) status = BookingStatus.PENDING;
        else if (statusRoll < 0.50) status = BookingStatus.CONFIRMED;
        else if (statusRoll < 0.80) { status = BookingStatus.PAID; paymentStatus = PaymentStatus.SUCCEEDED; }
        else { status = BookingStatus.COMPLETED; paymentStatus = PaymentStatus.SUCCEEDED; }

        const booking = bookingRepo.create({
          bookingReference: generateRef(),
          userId: user.id,
          tourId: tour.id,
          numberOfPassengers: passengers,
          basePricePerPerson: basePrice,
          commissionRate,
          commissionAmount,
          totalBasePrice,
          totalCommission: commissionAmount,
          totalPrice,
          currency: 'USD',
          status,
          tourDate: new Date(bookingDate.getTime() + randomInt(7, 60) * 86400000),
          createdAt: bookingDate,
        });

        const savedBooking = await bookingRepo.save(booking);

        // Create passengers
        for (let p = 0; p < passengers; p++) {
          const pg = randomChoice(testUsers);
          const passenger = passengerRepo.create({
            bookingId: savedBooking.id,
            firstName: pg.firstName,
            lastName: pg.lastName,
            passportNumber: `P${randomInt(1000000, 9999999)}`,
            dateOfBirth: new Date(1970 + randomInt(0, 30), randomInt(0, 11), randomInt(1, 28)),
            isLeadPassenger: p === 0,
          });
          await passengerRepo.save(passenger);
        }

        bookingCount++;

        // Create payment for paid/completed bookings
        if (paymentStatus) {
          const payment = paymentRepo.create({
            bookingId: savedBooking.id,
            payerId: user.id,
            amount: totalPrice,
            currency: 'USD',
            status: paymentStatus,
            stripePaymentIntentId: `pi_test_${uuidv4().substring(0, 12)}`,
            paidAt: new Date(bookingDate.getTime() + randomInt(0, 2) * 86400000),
            createdAt: bookingDate,
          });
          await paymentRepo.save(payment);
          paymentCount++;
        }

        // Add some failed payments (5%)
        if (Math.random() < 0.05) {
          const failedPayment = paymentRepo.create({
            bookingId: savedBooking.id,
            payerId: user.id,
            amount: totalPrice,
            currency: 'USD',
            status: PaymentStatus.FAILED,
            failureReason: randomChoice(['Card declined', 'Insufficient funds', 'Network error']),
            createdAt: bookingDate,
          });
          await paymentRepo.save(failedPayment);
          paymentCount++;
        }
      }
    }

    console.log(`✓ Created ${bookingCount} bookings`);
    console.log(`✓ Created ${paymentCount} payments`);

    // Summary
    const totalViews = await viewRepo.count();
    const totalBookings = await bookingRepo.count();
    const totalPayments = await paymentRepo.count();

    console.log(`\n=== Analytics Seed Complete ===`);
    console.log(`Tour Views:  ${totalViews}`);
    console.log(`Bookings:    ${totalBookings}`);
    console.log(`Payments:    ${totalPayments}`);
    console.log(`Tours:       ${tours.length}`);
    console.log(`Users:       ${testUsers.length}`);

    await AppDataSource.destroy();
  } catch (error: any) {
    console.error('Analytics seed failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seed();
