import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    modulePathIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/worker/"
    ],
    modulePaths: [
        "<rootDir>/src/"
    ],
    preset: "ts-jest",
    testMatch: [
        "**/test/**/*.[jt]s?(x)",
        "**/test/**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/worker/"
    ]
}

export default config;
