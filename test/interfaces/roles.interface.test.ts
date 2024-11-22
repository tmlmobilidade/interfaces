import { roles } from '@/interfaces';
import { Role } from '@/types';
import { ObjectId, WithId } from 'mongodb';

const newRole: WithId<Role> = {
	_id: new ObjectId(),
	name: 'Admin',
	permissions: [],
};

describe('RolesClass', () => {
	afterAll(async () => {
		await roles.disconnect();
	});

	describe('insertOne', () => {
		it('should insert a new role', async () => {
			const result = await roles.insertOne(newRole);
			expect(result.insertedId).toBeDefined();

			const insertedRole = await roles.findById(result.insertedId.toString());
			expect(insertedRole).toBeDefined();
			expect(insertedRole?.name).toBe(newRole.name);
		});

		it('should throw an error if the role already exists', async () => {
			await expect(roles.insertOne(newRole)).rejects.toThrow();
		});
	});

	describe('findById', () => {
		it('should find a role by its ID', async () => {
			const role = await roles.findById(newRole._id.toString());
			expect(role?._id.toString()).toBe(newRole._id.toString());
		});

		it('should return null if the role is not found', async () => {
			const role = await roles.findById(new ObjectId().toString());
			expect(role).toBeNull();
		});
	});

	describe('findByName', () => {
		it('should find a role by its name', async () => {
			const role = await roles.findByName(newRole.name);
			expect(role?.name).toBe(newRole.name);
		});

		it('should return null if the role is not found', async () => {
			const role = await roles.findByName('NON_EXISTENT_ROLE');
			expect(role).toBeNull();
		});
	});

	describe('updateById', () => {
		it('should update a role\'s name', async () => {
			const updatedFields = { name: 'Super Admin' };
			const updateResult = await roles.updateById(newRole._id, updatedFields);
			expect(updateResult.modifiedCount).toBe(1);

			const updatedRole = await roles.findById(newRole._id.toString());
			expect(updatedRole?.name).toBe(updatedFields.name);
		});

		it('should return modifiedCount as 0 if the role does not exist', async () => {
			const updateResult = await roles.updateById(new ObjectId(), { name: 'Should Not Update' });
			expect(updateResult.modifiedCount).toBe(0);
		});
	});

	describe('deleteOne', () => {
		it('should delete a role', async () => {
			const result = await roles.deleteOne({ _id: newRole._id });
			expect(result.deletedCount).toBe(1);

			const deletedRole = await roles.findById(newRole._id.toString());
			expect(deletedRole).toBeNull();
		});

		it('should return deletedCount as 0 if the role does not exist', async () => {
			const result = await roles.deleteOne({ _id: new ObjectId() });
			expect(result.deletedCount).toBe(0);
		});
	});

	describe('deleteMany', () => {
		const rolesToDelete: WithId<Role>[] = [
			{ _id: new ObjectId(), name: 'Test Role 1', permissions: [] },
			{ _id: new ObjectId(), name: 'Test Role 2', permissions: [] },
		];

		beforeAll(async () => {
			await roles.insertMany(rolesToDelete);
		});

		it('should delete multiple roles', async () => {
			const result = await roles.deleteMany({ name: { $in: rolesToDelete.map(role => role.name) } });
			expect(result.deletedCount).toBe(rolesToDelete.length);
		});

		it('should return deletedCount as 0 if no roles match the filter', async () => {
			const result = await roles.deleteMany({ name: 'NON_EXISTENT_ROLE' });
			expect(result.deletedCount).toBe(0);
		});
	});
});
