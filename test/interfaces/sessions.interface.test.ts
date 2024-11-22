import { sessions } from '@/interfaces';
import { Session } from '@/types';
import { ObjectId, WithId } from 'mongodb';

const newSession: WithId<Session> = {
	_id: new ObjectId(),
	token: 'test_token',
	user_id: new ObjectId(),
};

describe('SessionsClass', () => {
	afterAll(async () => {
		await sessions.disconnect();
	});

	describe('insertOne', () => {
		it('should insert a new session', async () => {
			const result = await sessions.insertOne(newSession);
			expect(result.insertedId).toBeDefined();

			const insertedSession = await sessions.findById(result.insertedId.toString());
			expect(insertedSession).toBeDefined();
			expect(insertedSession?.token).toBe(newSession.token);
		});

		it('should throw an error if the session already exists', async () => {
			await expect(sessions.insertOne(newSession)).rejects.toThrow();
		});
	});

	describe('findById', () => {
		it('should find a session by its ID', async () => {
			const session = await sessions.findById(newSession._id.toString());
			expect(session?._id.toString()).toBe(newSession._id.toString());
		});

		it('should return null if the session is not found', async () => {
			const session = await sessions.findById(new ObjectId().toString());
			expect(session).toBeNull();
		});
	});

	describe('deleteOne', () => {
		it('should delete a session', async () => {
			const result = await sessions.deleteOne({ _id: newSession._id });
			expect(result.deletedCount).toBe(1);

			const deletedSession = await sessions.findById(newSession._id.toString());
			expect(deletedSession).toBeNull();
		});

		it('should return deletedCount as 0 if the session does not exist', async () => {
			const result = await sessions.deleteOne({ _id: new ObjectId() });
			expect(result.deletedCount).toBe(0);
		});
	});

	describe('deleteMany', () => {
		const sessionsToDelete = [
			{ _id: new ObjectId(), created_at: new Date(), token: 'token_1', updated_at: new Date(), user_id: new ObjectId() },
			{ _id: new ObjectId(), created_at: new Date(), token: 'token_2', updated_at: new Date(), user_id: new ObjectId() },
		];

		beforeAll(async () => {
			await sessions.insertMany(sessionsToDelete);
		});

		it('should delete multiple sessions', async () => {
			const result = await sessions.deleteMany({});
			expect(result.deletedCount).toBe(sessionsToDelete.length);
		});

		it('should return deletedCount as 0 if no sessions match the filter', async () => {
			const result = await sessions.deleteMany({ token: 'NON_EXISTENT_TOKEN' });
			expect(result.deletedCount).toBe(0);
		});
	});
});
