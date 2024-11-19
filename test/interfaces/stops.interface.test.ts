import { stops } from '@/interfaces';
import { Stop } from '@/types';
import { mockMunicipalities, mockStops } from '@test/data/db-mock';
import { ObjectId, Sort, WithId } from 'mongodb';

const newStop: WithId<Stop> = {
	...mockStops[0],
	_id: new ObjectId(),
	code: 'NEW_CODE',
};

describe('StopsClass', () => {
	afterAll(async () => {
		await stops.disconnect();
	});

	describe('findByCode', () => {
		it('should find a stop by its code', async () => {
			const stop = await stops.findByCode(mockStops[0].code);
			expect(stop?.code).toBe(mockStops[0].code);
		});

		it('should return undefined if the stop is not found', async () => {
			const stop = await stops.findByCode('999999');
			expect(stop).toBeNull();
		});
	});

	describe('findByMunicipalityCode', () => {
		it('should find stops by municipality code', async () => {
			const municipalityCode = mockMunicipalities[0].code;
			const result = await stops.findByMunicipalityCode(municipalityCode);

			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThan(0);

			result.forEach((stop) => {
				expect(stop.municipality_code).toBe(municipalityCode);
			});
		});

		it('should return an empty array if no stops are found for the municipality code', async () => {
			const municipalityCode = 'NON_EXISTENT_CODE';
			const result = await stops.findByMunicipalityCode(municipalityCode);
			expect(result).toEqual([]);
		});

		it('should apply pagination correctly', async () => {
			const municipalityCode = mockMunicipalities[0].code;
			const perPage = 1;
			const page = 1;
			const result = await stops.findByMunicipalityCode(municipalityCode, perPage, page);
			expect(result.length).toBeLessThanOrEqual(perPage);
		});

		it('should apply sorting correctly', async () => {
			const municipalityCode = mockMunicipalities[0].code;
			const sort: Sort = { name: 1 };

			const result = await stops.findByMunicipalityCode(municipalityCode, undefined, undefined, sort);
			for (let i = 1; i < result.length; i++) {
				expect(result[i].name >= result[i - 1].name).toBe(true);
			}
		});
	});

	describe('findManyByCodes', () => {
		it('should find multiple stops by their codes', async () => {
			const codes = [mockStops[0].code, mockStops[1].code];
			const result = await stops.findManyByCodes(codes);
			expect(result.length).toBe(2);
			const foundCodes = result.map(stop => stop.code);
			expect(foundCodes).toContain(mockStops[0].code);
			expect(foundCodes).toContain(mockStops[1].code);
		});

		it('should return only existing stops when some codes do not exist', async () => {
			const codes = [mockStops[0].code, 'NON_EXISTENT_CODE'];
			const result = await stops.findManyByCodes(codes);
			expect(result.length).toBe(1);
			expect(result[0].code).toBe(mockStops[0].code);
		});

		it('should return an empty array if no codes match', async () => {
			const codes = ['INVALID_CODE1', 'INVALID_CODE2'];
			const result = await stops.findManyByCodes(codes);
			expect(result).toEqual([]);
		});
	});

	describe('updateByCode', () => {
		it('should update a stop by its code', async () => {
			const code = mockStops[0].code;
			const updateFields = { name: 'Updated Stop Name' };
			const updateResult = await stops.updateByCode(code, updateFields);
			expect(updateResult.modifiedCount).toBe(1);

			const updatedStop = await stops.findByCode(code);
			expect(updatedStop?.name).toBe('Updated Stop Name');
		});

		it('should return modifiedCount as 0 if the stop does not exist', async () => {
			const code = 'NON_EXISTENT_CODE';
			const updateFields = { name: 'Should Not Update' };
			const updateResult = await stops.updateByCode(code, updateFields);
			expect(updateResult.modifiedCount).toBe(0);
		});

		it('should handle partial updates correctly', async () => {
			const code = mockStops[1].code;
			const originalStop = await stops.findByCode(code);
			const updateFields = { locality: 'Updated Locality' };
			const updateResult = await stops.updateByCode(code, updateFields);
			expect(updateResult.modifiedCount).toBe(1);

			const updatedStop = await stops.findByCode(code);
			expect(updatedStop?.locality).toBe('Updated Locality');
			// Ensure other fields remain unchanged
			expect(updatedStop?.name).toBe(originalStop?.name);
		});
	});

	describe('findAll', () => {
		it('should find all stops', async () => {
			const result = await stops.all();
			expect(result.length).toBe(mockStops.length);
		});
	});

	describe('insertOne', () => {
		afterAll(async () => {
			await stops.deleteOne({ _id: newStop._id });
		});

		it('should insert a stop', async () => {
			delete newStop.created_at;
			delete newStop.updated_at;

			const result = await stops.insertOne(newStop);
			expect(result.insertedId).toBeDefined();

			const insertedStop = await stops.findByCode(newStop.code);

			expect(insertedStop).toBeDefined();
			expect(insertedStop?.created_at).toBeDefined();
			expect(insertedStop?.updated_at).toBeDefined();

			delete insertedStop?.created_at;
			delete insertedStop?.updated_at;

			expect(insertedStop).toEqual(newStop);
		});

		it('should throw an error if the stop already exists', async () => {
			const newStop = mockStops[0];
			await expect(stops.insertOne(newStop)).rejects.toThrow();
		});
	});

	describe('insertMany', () => {
		it('should insert multiple stops', async () => {
			const newStops = mockStops.map(stop => ({
				...stop,
				_id: new ObjectId(),
				code: `${stop.code}_NEW`,
				created_at: new Date(),
				updated_at: new Date(),
			}));

			const result = await stops.insertMany(newStops);
			expect(result.insertedCount).toBe(mockStops.length);

			for (const insertedId of Object.values(result.insertedIds)) {
				await stops.deleteOne({ _id: insertedId });
			}
		});

		it('should throw an error if some stops already exist', async () => {
			await expect(stops.insertMany(mockStops)).rejects.toThrow();
		});
	});

	describe('deleteOne', () => {
		beforeAll(async () => {
			await stops.insertOne(newStop);
		});

		it('should delete a stop', async () => {
			const result = await stops.deleteOne({ _id: newStop._id });
			expect(result.deletedCount).toBe(1);

			const count = await stops.count();
			expect(count).toBe(mockStops.length);
		});

		it('it should return deletedCount as 0 if the stop does not exist', async () => {
			const result = await stops.deleteOne({ _id: new ObjectId() });
			expect(result.deletedCount).toBe(0);
		});
	});

	describe('deleteMany', () => {
		it('should delete multiple stops', async () => {
			const result = await stops.deleteMany({});
			expect(result.deletedCount).toBe(mockStops.length);
		});

		it('should return deletedCount as 0 if no stops match the filter', async () => {
			const result = await stops.deleteMany({ code: 'NON_EXISTENT_CODE' });
			expect(result.deletedCount).toBe(0);
		});
	});
});
