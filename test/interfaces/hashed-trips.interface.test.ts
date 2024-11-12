import { hashedTrips } from '@/interfaces/hashed-trips.interface';
import { HashedTrip } from '@/types/ride';

const newHashedTrip: HashedTrip = {
	agency_id: 'agency_1',
	code: 'HASHED_TRIP_1',
	line_id: 'line_1',
	line_long_name: 'Long Line Name',
	line_short_name: 'Short Line Name',
	path: [
		{
			arrival_time: '10:00:00',
			departure_time: '10:05:00',
			drop_off_type: 'regular',
			pickup_type: 'regular',
			stop_id: 'stop_1',
			stop_lat: '38.79627920200005',
			stop_lon: '-9.23542624099997',
			stop_name: 'Stop 1',
			stop_sequence: 1,
			timepoint: 'true',
		},
	],
	pattern_id: 'pattern_1',
	route_color: '#FF0000',
	route_id: 'route_1',
	route_long_name: 'Long Route Name',
	route_short_name: 'Short Route Name',
	route_text_color: '#FFFFFF',
	trip_headsign: 'Trip Head Sign',
};

describe('HashedTripsClass', () => {
	afterAll(async () => {
		await hashedTrips.disconnect();
	});

	describe('insertOne', () => {
		it('should insert a new hashed trip', async () => {
			const result = await hashedTrips.insertOne(newHashedTrip);
			expect(result.insertedId).toBeDefined();

			const insertedTrip = await hashedTrips.findByCode(newHashedTrip.code);
			expect(insertedTrip).toBeDefined();
			expect(insertedTrip?.code).toBe(newHashedTrip.code);
		});

		it('should throw an error if the hashed trip already exists', async () => {
			await expect(hashedTrips.insertOne(newHashedTrip)).rejects.toThrow();
		});
	});

	describe('findByCode', () => {
		it('should find a hashed trip by its code', async () => {
			const trip = await hashedTrips.findByCode(newHashedTrip.code);
			expect(trip?.code).toBe(newHashedTrip.code);
		});

		it('should return null if the hashed trip is not found', async () => {
			const trip = await hashedTrips.findByCode('NON_EXISTENT_CODE');
			expect(trip).toBeNull();
		});
	});

	describe('updateByCode', () => {
		it('should update a hashed trip', async () => {
			const updatedFields = { line_long_name: 'Updated Long Line Name' };
			const updateResult = await hashedTrips.updateByCode(newHashedTrip.code, updatedFields);
			expect(updateResult.modifiedCount).toBe(1);

			const updatedTrip = await hashedTrips.findByCode(newHashedTrip.code);
			expect(updatedTrip?.line_long_name).toBe('Updated Long Line Name');
		});

		it('should return null if the hashed trip is not found', async () => {
			const updateResult = await hashedTrips.updateByCode('NON_EXISTENT_CODE', { line_long_name: 'Updated Long Line Name' });
			expect(updateResult.modifiedCount).toBe(0);
		});
	});
});
