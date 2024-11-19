/**
 * Unit tests for AuthProvider
 */

import { roles, sessions, users } from '@/interfaces';
import HttpException from '@/lib/http-exception';
import HttpStatus from '@/lib/http-status';
import { AuthProvider } from '@/providers';
import { Email, LoginDto } from '@/types';
import { mockPermissions, mockRoles, mockUsers } from '@test/data/db-mock';
import bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthProvider', () => {
	beforeEach(async () => {
		// Clear the sessions collection before each test
		await sessions.deleteMany({});
		// Clear all mocks before each test
		// jest.clearAllMocks();
	});

	afterAll(async () => {
		// Disconnect from the database after all tests
		await sessions.deleteMany({});
		await sessions.disconnect();
		await users.disconnect();
		await roles.disconnect();
	});

	describe('login', () => {
		const validEmail = mockUsers[0].email;
		const validPassword = 'validPassword';
		const invalidPassword = 'invalidPassword';

		beforeAll(() => {
			// Mock bcrypt.compare
			(bcrypt.compare as jest.Mock).mockImplementation((password: string, hash: string) => {
				return password === validPassword && hash === 'hashedPassword';
			});
		});

		it('should create a new session for valid credentials', async () => {
			// Arrange
			const loginDto: LoginDto = {
				email: validEmail,
				password: validPassword,
			};

			// Act
			const session = await AuthProvider.login(loginDto);

			// Assert
			expect(session).toBeDefined();
			expect(session.token).toBeDefined();
			expect(session.user_id).toBeDefined();

			// Verify the session is stored in the database
			const storedSession = await sessions.findOne({ token: session.token });
			expect(storedSession).toBeDefined();

			// Cannot compare ObjectId directly, so we compare the string representations
			expect(storedSession?.user_id.toString()).toBe(session.user_id.toString());
		});

		it('should throw UNAUTHORIZED if user is not found', async () => {
			// Arrange
			const loginDto: LoginDto = {
				email: 'nonexistent@example.com' as Email,
				password: validPassword,
			};

			// Act & Assert
			await expect(AuthProvider.login(loginDto)).rejects.toThrow(
				new HttpException(HttpStatus.UNAUTHORIZED, 'User not found'),
			);
		});

		it('should throw UNAUTHORIZED if password is incorrect', async () => {
			// Arrange
			const loginDto: LoginDto = {
				email: validEmail,
				password: invalidPassword,
			};

			// Act & Assert
			await expect(AuthProvider.login(loginDto)).rejects.toThrow(
				new HttpException(HttpStatus.UNAUTHORIZED, 'Invalid password'),
			);
		});
	});

	describe('logout', () => {
		it('should delete the session', async () => {
			// Arrange
			const session = {
				token: 'test-token',
				user_id: mockUsers[0]._id,
			};

			const result = await sessions.insertOne(session);
			expect(result.acknowledged).toBe(true);

			// Act
			await AuthProvider.logout(session.token);

			// Assert
			const storedSession = await sessions.findOne({ token: session.token });
			expect(storedSession).toBeNull();
		});
	});

	describe('getUser', () => {
		it('should return the user associated with the session', async () => {
			const session = {
				token: 'test-token',
				user_id: mockUsers[0]._id,
			};

			await sessions.insertOne(session);

			const user = await AuthProvider.getUser(session.token);
			expect(user).toBeDefined();
			expect(user?._id.toString()).toBe(mockUsers[0]._id.toString());
		});
	});

	describe('getPermissions', () => {
		const sessionToken = 'test-token';

		afterEach(async () => {
			await sessions.deleteOne({ token: sessionToken });
		});

		it('should return the permissions if the user with no permissions but with role that has the permission', async () => {
			const session = {
				token: sessionToken,
				user_id: mockUsers[0]._id,
			};

			await sessions.insertOne(session);

			const user = await users.findById(mockUsers[0]._id);
			expect(user).toBeDefined();
			expect(user?.role_ids[0].toString()).toBe(mockRoles[0]._id.toString());
			expect(user?.permissions.length).toBe(0);

			const permissions = await AuthProvider.getPermissions(session.token, mockRoles[0].permissions[0].scope, mockRoles[0].permissions[0].action);
			expect(permissions).toBeDefined();
			expect(Object.keys(permissions).length).toBeGreaterThanOrEqual(1);
		});

		it('should return the permissions if the user with permissions and no role has the permission', async () => {
			const session = {
				token: sessionToken,
				user_id: mockUsers[2]._id,
			};

			await sessions.insertOne(session);

			const user = await users.findById(mockUsers[2]._id);
			expect(user).toBeDefined();
			expect(user?.role_ids.length).toBe(0);
			expect(user?.permissions.length).toBeGreaterThan(0);

			const permissions = await AuthProvider.getPermissions(session.token, mockPermissions[1].scope, mockPermissions[1].action);
			expect(permissions).toBeDefined();
			expect(Object.keys(permissions).length).toBeGreaterThanOrEqual(1);
		});

		it('should throw FORBIDDEN if the user does not have the permission', async () => {
			const session = {
				token: sessionToken,
				user_id: mockUsers[2]._id,
			};

			await sessions.insertOne(session);

			await expect(AuthProvider.getPermissions(session.token, mockPermissions[0].scope, mockPermissions[0].action)).rejects.toThrow(
				new HttpException(HttpStatus.FORBIDDEN, 'User does not have permission'),
			);
		});

		it('should return the merged permissions if the user has permissions and roles', async () => {
			const session = {
				token: sessionToken,
				user_id: mockUsers[1]._id,
			};

			await sessions.insertOne(session);

			const permissions = await AuthProvider.getPermissions(session.token, mockRoles[1].permissions[0].scope, mockRoles[1].permissions[0].action);

			expect(permissions).toBeDefined();
			expect(Object.keys(permissions).length).toBeGreaterThanOrEqual(1);
			// TODO: Fix _id buffer issue
			expect({ ...permissions, _id: undefined }).toEqual({ ...mockPermissions[4], _id: undefined });
		});
	});
});
