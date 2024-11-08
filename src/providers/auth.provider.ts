import { roles } from '@/interfaces';
import { sessions } from '@/interfaces/sessions.interface';
import { users } from '@/interfaces/users.interface';
import HttpException from '@/lib/http-exception';
import HttpStatus from '@/lib/http-status';
import MongoError from '@/lib/mongo-error';
import { generateRandomToken } from '@/lib/utils';
import { LoginDto, RegisterDto } from '@/types';
import { MongoServerError } from 'mongodb';

class AuthProvider {
	/**
	 * Gets a user by their session token
	 *
	 * @param session_token - The session token to look up
	 * @returns The user associated with the session token
	 * @throws {HttpException}
	 *   - UNAUTHORIZED if session not found
	 *   - UNAUTHORIZED if user not found
	 */
	static async getUser(session_token: string) {
		// TODO: Implement caching with redis

		const session = await sessions.findOne({ token: session_token });

		if (!session) {
			throw new HttpException(HttpStatus.UNAUTHORIZED, 'Session not found');
		}

		const user = await users.findById(session.user_id);

		if (!user) {
			throw new HttpException(HttpStatus.UNAUTHORIZED, 'User not found');
		}

		return user;
	}

	/**
	 * Has Permission
	 *
	 * @param session_token - The session token
	 * @param scope - The scope to check
	 * @param action - The action to check
	 * @returns True if the user has the permission, false otherwise
	 */
	static async hasPermission(session_token: string, scope: string, action: string) {
		const user = await this.getUser(session_token);
		const role_list = await roles.findMany({ _id: { $in: user.role_ids } });

		// Join all permissions from all roles and user permissions
		const permissions = [...role_list.flatMap(role => role.permissions), ...user.permissions];

		return permissions.some(permission => permission.scope === scope && permission.action === action);
	}

	/**
	 * Login a user
	 *
	 * @param username - The username of the user
	 * @param password_hash - The password hash of the user, already hashed with bcrypt in client
	 * @returns The newly created session for the logged in user
	 * @throws {HttpException}
	 *   - UNAUTHORIZED if user not found or password is incorrect
	 *   - INTERNAL_SERVER_ERROR if login fails
	 */
	static async login(dto: LoginDto) {
		// TODO: Implement caching with redis

		try {
			const user = await users.findByEmail(dto.email);

			if (!user) {
				throw new HttpException(HttpStatus.UNAUTHORIZED, 'User not found');
			}

			if (user.password_hash !== dto.password_hash) {
				throw new HttpException(HttpStatus.UNAUTHORIZED, 'Invalid password');
			}

			const session = await sessions.insertOne({
				token: generateRandomToken(),
				user_id: user._id.toString(),
			});

			return session;
		}
		catch (error) {
			throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'Error logging in user', error);
		}
	}

	/**
	 * Logout a user
	 *
	 * @param session_token - The session token to logout
	 */
	static async logout(session_token: string) {
		// TODO: Invalidate cache

		await sessions.deleteOne({ token: session_token });
	}

	/**
	 * Register a new user
	 *
	 * @param dto - The registration data transfer object containing:
	 *   - email: Email address for the new user
	 *   - password_hash: Password hash already generated with bcrypt on client side
	 * @returns The newly created session for the registered user
	 * @throws {HttpException}
	 *   - CONFLICT if user already exists
	 *   - INTERNAL_SERVER_ERROR if registration fails
	 */
	static async register(dto: RegisterDto) {
		// TODO: Implement caching with redis

		try {
			const user = await users.insertOne({
				created_at: new Date(),
				email: dto.email,
				organization_ids: [],
				password_hash: dto.password_hash,
				permissions: [],
				phone: '',
				role_ids: [],
				session_ids: [],
				updated_at: new Date(),
				verification_token_ids: [],
			});

			const session = await sessions.insertOne({
				token: generateRandomToken(),
				user_id: user.insertedId.toString(),
			});

			return session;
		}
		catch (error) {
			if (error instanceof MongoServerError && error.code === MongoError.DUPLICATE_KEY) {
				throw new HttpException(HttpStatus.CONFLICT, 'User already exists');
			}

			throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'Error registering user', error);
		}
	}

	static async resetPassword(email: string, password_hash: string) {
		// TODO: Implement password reset
		throw new Error('Not implemented');
	}

	static async sendEmailVerification(user_id: string) {
		// TODO: Implement email sending
		throw new Error('Not implemented');
	}

	static async sendPasswordResetEmail(user_id: string) {
		// TODO: Implement email sending
		throw new Error('Not implemented');
	}

	static async sendVerificationEmail(user_id: string) {
		// TODO: Implement email sending
		throw new Error('Not implemented');
	}

	static async verifyEmail(token: string) {
		// TODO: Implement email verification
		throw new Error('Not implemented');
	}
}

export default AuthProvider;
