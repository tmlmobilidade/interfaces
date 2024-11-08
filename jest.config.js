module.exports = {
	moduleDirectories: ['node_modules', 'src'], // So Jest can resolve modules
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@test/(.*)$': '<rootDir>/test/$1',
	},
	preset: 'ts-jest',
	setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
	testEnvironment: 'node',
};
