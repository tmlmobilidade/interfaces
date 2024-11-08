import { users } from '@/interfaces';
import { User } from '@/types';
import { mockUsers } from '@test/data/db-mock';
import { ObjectId, Sort, WithId } from 'mongodb';

const newUser: WithId<User> = {
	...mockUsers[0],
	_id: new ObjectId(),
	email: 'newuser@example.com',
};

describe('UsersClass', () => {
	afterAll(async () => {
		await users.disconnect();
	});

	describe('findByEmail', () => {
		it('should find a user by their email', async () => {
			const user = await users.findByEmail(mockUsers[0].email);
			expect(user?.email).toBe(mockUsers[0].email);

			expect(user?.password_hash).toBeUndefined();
		});

		it('should return null if the user is not found', async () => {
			const user = await users.findByEmail('nonexistent@example.com');
			expect(user).toBeNull();
		});
	});

	describe('findById', () => {
		it('should find a user by their ID', async () => {
			const user = await users.findById(mockUsers[0]._id.toString());
			expect(user?._id.toString()).toBe(mockUsers[0]._id.toString());

			expect(user?.password_hash).toBeUndefined();
		});

		it('should return null if the ID does not exist', async () => {
			const user = await users.findById(new ObjectId().toString());
			expect(user).toBeNull();
		});
	});

	describe('findByOrganization', () => {
		it('should find users by organization code', async () => {
			const organizationCode = mockUsers[0].organization_ids[0];
			const result = await users.findByOrganization(organizationCode);

			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThan(0);
			result.forEach((user) => {
				const orgIds = mockUsers[0].organization_ids.map(id => id.toString());
				const matches = user.organization_ids.some(id => orgIds.includes(id.toString()));
				expect(matches).toBe(true);
			});

			result.forEach((user) => {
				expect(user.password_hash).toBeUndefined();
			});
		});

		it('should return an empty array if no users are found for the organization code', async () => {
			const organizationCode = new ObjectId();
			const result = await users.findByOrganization(organizationCode);
			expect(result).toEqual([]);
		});
	});

	describe('findByRole', () => {
		it('should find users by their role ID', async () => {
			const roleId = mockUsers[0].role_ids[0].toString();
			const result = await users.findByRole(roleId);

			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThan(0);
			result.forEach((user) => {
				expect(user.role_ids.map(id => id.toString())).toContain(roleId);
			});

			result.forEach((user) => {
				expect(user.password_hash).toBeUndefined();
			});
		});

		it('should return an empty array if no users have the specified role', async () => {
			const roleId = new ObjectId().toString();
			const result = await users.findByRole(roleId);
			expect(result).toEqual([]);
		});
	});

	describe('findMany', () => {
		it('should find users with pagination and sorting', async () => {
			const sort: Sort = { email: 1 };
			const perPage = 1;
			const page = 1;
			const result = await users.findMany({}, perPage, page, sort);
			expect(result.length).toBeLessThanOrEqual(perPage);

			result.forEach((user) => {
				expect(user.password_hash).toBeUndefined();
			});
		});

		it('should return an empty array if no users match the filter', async () => {
			const filter = { email: 'nonexistent@example.com' };
			const result = await users.findMany(filter);
			expect(result).toEqual([]);
		});
	});

	describe('findOne', () => {
		it('should find a single user matching the filter', async () => {
			const filter = { email: mockUsers[0].email };
			const user = await users.findOne(filter);
			expect(user?.email).toBe(mockUsers[0].email);

			expect(user?.password_hash).toBeUndefined();
		});

		it('should return null if no user matches the filter', async () => {
			const filter = { email: 'nonexistent@example.com' };
			const user = await users.findOne(filter);
			expect(user).toBeNull();
		});
	});

	describe('insertOne', () => {
		afterAll(async () => {
			await users.deleteOne({ _id: newUser._id });
		});

		it('should insert a new user', async () => {
			delete newUser.created_at;
			delete newUser.updated_at;

			const result = await users.insertOne(newUser);
			expect(result.insertedId).toBeDefined();

			const insertedUser = await users.findById(newUser._id.toString());
			expect(insertedUser).toBeDefined();
			expect(insertedUser?.email).toBe(newUser.email);

			expect(insertedUser?.password_hash).toBeUndefined();
		});

		it('should throw an error if the user already exists', async () => {
			const existingUser = mockUsers[0];
			await expect(users.insertOne(existingUser)).rejects.toThrow();
		});
	});

	describe('insertMany', () => {
		const newUsers = mockUsers.map(user => ({
			...user,
			_id: new ObjectId(),
			created_at: new Date(),
			email: `new_${user.email}`,
			updated_at: new Date(),
		}));

		afterAll(async () => {
			const ids = newUsers.map(user => user._id);
			await users.deleteMany({ _id: { $in: ids } });
		});

		it('should insert multiple users', async () => {
			const result = await users.insertMany(newUsers);
			expect(result.insertedCount).toBe(newUsers.length);
		});

		it('should throw an error if some users already exist', async () => {
			await expect(users.insertMany(mockUsers)).rejects.toThrow();
		});
	});

	describe('updateOne', () => {
		it('should update a user\'s email', async () => {
			const userId = mockUsers[0]._id;
			const updateFields = { email: 'updated_email@example.com' };
			const updateResult = await users.update({ _id: userId }, updateFields);
			expect(updateResult.modifiedCount).toBe(1);

			const updatedUser = await users.findById(userId);
			expect(updatedUser?.email).toBe(updateFields.email);

			await users.update({ _id: userId }, { email: mockUsers[0].email });
		});

		it('should return modifiedCount as 0 if the user does not exist', async () => {
			const nonExistentId = new ObjectId().toString();
			const updateFields = { email: 'nonexistent@example.com' };
			const updateResult = await users.update({ _id: new ObjectId(nonExistentId) }, updateFields);
			expect(updateResult.modifiedCount).toBe(0);
		});
	});

	describe('updateMany', () => {
		const usersToUpdate = mockUsers.map(user => ({
			...user,
			_id: new ObjectId(),
			created_at: new Date(),
			email: `update_${user.email}`,
			updated_at: new Date(),
		}));

		beforeAll(async () => {
			await users.insertMany(usersToUpdate);
		});

		it('should update multiple users\' emails', async () => {
			const emails = usersToUpdate.map(user => user.email);
			const updateFields = { first_name: 'updated_first_name' };
			const updateResult = await users.updateMany({ email: { $in: emails } }, updateFields);
			expect(updateResult.modifiedCount).toBe(usersToUpdate.length);
		});
	});

	describe('deleteOne', () => {
		beforeAll(async () => {
			await users.insertOne(newUser);
		});

		it('should delete a user', async () => {
			const result = await users.deleteOne({ _id: newUser._id });
			expect(result.deletedCount).toBe(1);

			const deletedUser = await users.findById(newUser._id.toString());
			expect(deletedUser).toBeNull();
		});

		it('should return deletedCount as 0 if the user does not exist', async () => {
			const result = await users.deleteOne({ _id: new ObjectId() });
			expect(result.deletedCount).toBe(0);
		});
	});

	describe('deleteMany', () => {
		const usersToDelete = mockUsers.map(user => ({
			...user,
			_id: new ObjectId(),
			created_at: new Date(),
			email: `delete_${user.email}`,
			updated_at: new Date(),
		}));

		beforeAll(async () => {
			await users.insertMany(usersToDelete);
		});

		it('should delete multiple users', async () => {
			const emails = usersToDelete.map(user => user.email);
			const result = await users.deleteMany({ email: { $in: emails } });
			expect(result.deletedCount).toBe(usersToDelete.length);
		});

		it('should return deletedCount as 0 if no users match the filter', async () => {
			const result = await users.deleteMany({ email: 'nonexistent@example.com' });
			expect(result.deletedCount).toBe(0);
		});
	});
});
