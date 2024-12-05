import { rides } from '@/interfaces';
import { createOperationalDate, CreateRideDto } from '@/types';

const newRide: CreateRideDto = {
	_id: 'ride_1',
	agency_id: 'agency_1',
	analysis: [],
	driver_ids: [],
	extension_observed: null,
	extension_scheduled: 1,
	hashed_shape_id: 'HASHED_SHAPE_1',
	hashed_trip_id: 'HASHED_TRIP_1',
	headsign: 'headsign_1',
	line_id: 'line_1',
	operational_date: createOperationalDate('20240101'),
	passengers_estimated: null,
	pattern_id: 'pattern_1',
	plan_id: 'plan_1',
	route_id: 'route_1',
	runtime_observed: null,
	runtime_scheduled: 1,
	start_time_observed: null,
	start_time_scheduled: new Date(),
	status: 'complete',
	trip_id: 'trip_1',
	validations_count: null,
	vehicle_ids: [],
};

let rideId: string;

describe('RidesClass', () => {
	afterAll(async () => {
		await rides.disconnect();
	});

	describe('insertOne', () => {
		it('should insert a new ride', async () => {
			const result = await rides.insertOne(newRide);
			expect(result.insertedId).toBeDefined();
			rideId = result.insertedId.toString();

			const insertedRide = await rides.findById(rideId);
			expect(insertedRide).toBeDefined();
			expect(insertedRide?.agency_id).toBe(newRide.agency_id);
		});

		it('should throw an error if the ride already exists', async () => {
			await expect(rides.insertOne(newRide)).rejects.toThrow();
		});
	});

	describe('findByCode', () => {
		it('should find a ride by its code', async () => {
			const ride = await rides.findById(rideId);
			expect(ride?.agency_id).toBe(newRide.agency_id);
		});

		it('should return null if the ride is not found', async () => {
			const ride = await rides.findById('NON_EXISTENT_CODE');
			expect(ride).toBeNull();
		});
	});

	describe('updateByCode', () => {
		it('should update a ride', async () => {
			const updateResult = await rides.updateById(rideId, { status: 'complete' });
			expect(updateResult.modifiedCount).toBe(1);

			const updatedRide = await rides.findById(rideId);
			expect(updatedRide?.status).toBe('complete');
		});

		it('should return modifiedCount as 0 if the ride does not exist', async () => {
			const updateResult = await rides.updateById('NON_EXISTENT_CODE', { status: 'complete' });
			expect(updateResult.modifiedCount).toBe(0);
		});
	});

	describe('findByAgencyId', () => {
		it('should find rides by agency ID', async () => {
			const result = await rides.findByAgencyId(newRide.agency_id);
			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThan(0);
			result.forEach((ride) => {
				expect(ride.agency_id).toBe(newRide.agency_id);
			});
		});

		it('should return an empty array if no rides are found for the agency ID', async () => {
			const result = await rides.findByAgencyId('NON_EXISTENT_AGENCY_ID');
			expect(result).toEqual([]);
		});
	});
});
