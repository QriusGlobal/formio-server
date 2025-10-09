/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: './fixJSDOMEnvironment.ts',
	testPathIgnorePatterns: [
		'/node_modules/',
		'/lib/',
		'/dist/',
		'/test/',
		'/.+\\.d\\.ts$',
	],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
		'^.+\\.css$': 'jest-transform-css',
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	transformIgnorePatterns: [],
	verbose: true,
};
