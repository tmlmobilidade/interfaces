import { hashedShapes } from '@/interfaces/hashed-shapes.interface';
import { HashedShape } from '@/types/ride';

const newHashedShape: HashedShape = {
	agency_id: 'agency_1',
	code: 'HASHED_SHAPE_1',
	points: [
		{ shape_pt_lat: '38.79627920200005', shape_pt_lon: '-9.23542624099997', shape_pt_sequence: 1 },
		{ shape_pt_lat: '38.79641254500007', shape_pt_lon: '-9.235565959999974', shape_pt_sequence: 2 },
	],
	shape_id: 'shape_1',
};

describe('HashedShapesClass', () => {
	afterAll(async () => {
		await hashedShapes.disconnect();
	});

	describe('insertOne', () => {
		it('should insert a new hashed shape', async () => {
			const result = await hashedShapes.insertOne(newHashedShape);
			expect(result.insertedId).toBeDefined();

			const insertedShape = await hashedShapes.findByCode(newHashedShape.code);
			expect(insertedShape).toBeDefined();
			expect(insertedShape?.code).toBe(newHashedShape.code);
		});

		it('should throw an error if the hashed shape already exists', async () => {
			await expect(hashedShapes.insertOne(newHashedShape)).rejects.toThrow();
		});
	});

	describe('findByCode', () => {
		it('should find a hashed shape by its code', async () => {
			const shape = await hashedShapes.findByCode(newHashedShape.code);
			expect(shape?.code).toBe(newHashedShape.code);
		});

		it('should return null if the hashed shape is not found', async () => {
			const shape = await hashedShapes.findByCode('NON_EXISTENT_CODE');
			expect(shape).toBeNull();
		});
	});

	describe('updateByCode', () => {
		it('should update a hashed shape', async () => {
			const updatedFields = { agency_id: 'updated_agency' };
			const updateResult = await hashedShapes.updateByCode(newHashedShape.code, updatedFields);
			expect(updateResult.modifiedCount).toBe(1);

			const updatedShape = await hashedShapes.findByCode(newHashedShape.code);
			expect(updatedShape?.agency_id).toBe(updatedFields.agency_id);
		});

		it('should return modifiedCount as 0 if the hashed shape does not exist', async () => {
			const updateResult = await hashedShapes.updateByCode('NON_EXISTENT_CODE', { agency_id: 'should_not_update' });
			expect(updateResult.modifiedCount).toBe(0);
		});
	});

	describe('deleteOne', () => {
		it('should delete a hashed shape', async () => {
			const result = await hashedShapes.deleteOne({ code: newHashedShape.code });
			expect(result.deletedCount).toBe(1);

			const deletedShape = await hashedShapes.findByCode(newHashedShape.code);
			expect(deletedShape).toBeNull();
		});

		it('should return deletedCount as 0 if the hashed shape does not exist', async () => {
			const result = await hashedShapes.deleteOne({ code: 'NON_EXISTENT_CODE' });
			expect(result.deletedCount).toBe(0);
		});
	});
});
