import { verificationTokens } from '@/interfaces/verification-tokens.interface';
import { VerificationToken } from '@/types';
import { ObjectId, WithId } from 'mongodb';

const newToken: WithId<VerificationToken> = {
	_id: new ObjectId(),
	expires: new Date(Date.now() + 3600000), // 1 hour from now
	token: 'test_verification_token',
	user_id: new ObjectId(),
};

describe('VerificationTokensClass', () => {
	afterAll(async () => {
		await verificationTokens.disconnect();
	});

	describe('insertOne', () => {
		it('should insert a new verification token', async () => {
			const result = await verificationTokens.insertOne(newToken);
			expect(result.insertedId).toBeDefined();

			const insertedToken = await verificationTokens.findById(result.insertedId.toString());
			expect(insertedToken).toBeDefined();
			expect(insertedToken?.token).toBe(newToken.token);
		});

		it('should throw an error if the token already exists', async () => {
			await expect(verificationTokens.insertOne(newToken)).rejects.toThrow();
		});
	});

	describe('findByToken', () => {
		it('should find a verification token by its token', async () => {
			const token = await verificationTokens.findByToken(newToken.token);
			expect(token?.token).toBe(newToken.token);
		});

		it('should return null if the token is not found', async () => {
			const token = await verificationTokens.findByToken('NON_EXISTENT_TOKEN');
			expect(token).toBeNull();
		});
	});

	describe('deleteOne', () => {
		it('should delete a verification token', async () => {
			const result = await verificationTokens.deleteOne({ _id: newToken._id });
			expect(result.deletedCount).toBe(1);

			const deletedToken = await verificationTokens.findByToken(newToken.token);
			expect(deletedToken).toBeNull();
		});

		it('should return deletedCount as 0 if the token does not exist', async () => {
			const result = await verificationTokens.deleteOne({ _id: new ObjectId() });
			expect(result.deletedCount).toBe(0);
		});
	});

	describe('deleteMany', () => {
		const tokensToDelete: WithId<VerificationToken>[] = [
			{ ...newToken, _id: new ObjectId(), token: 'TOKEN_1' },
			{ ...newToken, _id: new ObjectId(), token: 'TOKEN_2' },
		];

		beforeAll(async () => {
			await verificationTokens.insertMany(tokensToDelete);
		});

		it('should delete multiple verification tokens', async () => {
			const result = await verificationTokens.deleteMany({ token: { $in: tokensToDelete.map(t => t.token) } });
			expect(result.deletedCount).toBe(tokensToDelete.length);
		});

		it('should return deletedCount as 0 if no tokens match the filter', async () => {
			const result = await verificationTokens.deleteMany({ token: 'NON_EXISTENT_TOKEN' });
			expect(result.deletedCount).toBe(0);
		});
	});
});
