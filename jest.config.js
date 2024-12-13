module.exports = {
	coveragePathIgnorePatterns: [
		'index.ts',
		'<rootDir>/src/connectors/',
		'<rootDir>/src/classes/',
		'<rootDir>/src/lib/',
		'<rootDir>/test/data/',
		'<rootDir>/src/utils/',
	],
	moduleDirectories: ['node_modules', 'src'], // So Jest can resolve modules
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@test/(.*)$': '<rootDir>/test/$1',
	},
	preset: 'ts-jest',
	setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
	testEnvironment: 'node',
};
