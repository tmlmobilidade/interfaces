import { rides } from '@/interfaces/rides.interface';
import { Ride } from '@/types/ride';

const newRide: Ride = {
	agency_id: 'agency_1',
	analysis: [],
	analysis_timestamp: null,
	archive_id: 'archive_1',
	code: 'RIDE_1',
	hashed_shape_code: 'HASHED_SHAPE_1',
	hashed_trip_code: 'HASHED_TRIP_1',
	line_id: 'line_1',
	operational_day: '2023-01-01',
	parse_timestamp: { $date: new Date().toISOString() },
	pattern_id: 'pattern_1',
	route_id: 'route_1',
	scheduled_start_time: '10:00:00',
	service_id: 'service_1',
	status: 'active',
	trip_id: 'trip_1',
	user_notes: 'Test ride',
};

describe('RidesClass', () => {
	afterAll(async () => {
		await rides.disconnect();
	});

	describe('insertOne', () => {
		it('should insert a new ride', async () => {
			const result = await rides.insertOne(newRide);
			expect(result.insertedId).toBeDefined();

			const insertedRide = await rides.findByCode(newRide.code);
			expect(insertedRide).toBeDefined();
			expect(insertedRide?.code).toBe(newRide.code);
		});

		it('should throw an error if the ride already exists', async () => {
			await expect(rides.insertOne(newRide)).rejects.toThrow();
		});
	});

	describe('findByCode', () => {
		it('should find a ride by its code', async () => {
			const ride = await rides.findByCode(newRide.code);
			expect(ride?.code).toBe(newRide.code);
		});

		it('should return null if the ride is not found', async () => {
			const ride = await rides.findByCode('NON_EXISTENT_CODE');
			expect(ride).toBeNull();
		});
	});

	describe('updateByCode', () => {
		it('should update a ride', async () => {
			const updatedFields = { status: 'inactive' };
			const updateResult = await rides.updateByCode(newRide.code, updatedFields);
			expect(updateResult.modifiedCount).toBe(1);

			const updatedRide = await rides.findByCode(newRide.code);
			expect(updatedRide?.status).toBe(updatedFields.status);
		});

		it('should return modifiedCount as 0 if the ride does not exist', async () => {
			const updateResult = await rides.updateByCode('NON_EXISTENT_CODE', { status: 'should_not_update' });
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
