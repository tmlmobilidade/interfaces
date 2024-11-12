/**
 * Unit tests for AuthProvider
 */

import { sessions, users } from '@/interfaces';
import HttpException from '@/lib/http-exception';
import HttpStatus from '@/lib/http-status';
import AuthProvider from '@/providers/auth.provider';
import { LoginDto } from '@/types';
import { mockUsers } from '@test/data/db-mock';
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
				email: 'nonexistent@example.com',
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
});
