module.exports = {
    preset: "jest-preset-angular",
    roots: ["src"],
    setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
    moduleNameMapper: {
      "@app/(.*)": "<rootDir>/src/app/$1",
      "@assets/(.*)": "<rootDir>/src/assets/$1",
      "@core/(.*)": "<rootDir>/src/app/core/$1",
      "@env": "<rootDir>/src/environments/environment",
      "@src/(.*)": "<rootDir>/src/src/$1",
      "@services/(.*)": "<rootDir>/src/app/core/services/$1",
      "@helpers/(.*)": "<rootDir>/src/app/helpers/$1",
      "@shared/(.*)": "<rootDir>/src/app/shared/$1",
    },
    coverageDirectory: "./coverage",
    collectCoverageFrom: [
      "src/app/**/*.ts",
      "!<rootDir>/node_modules/",
      "!<rootDir>/test/",
    ],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
      '/src/app/core/(?!services/auth)',
      '/src/app/features',
      '/src/app/shared/components/navbar',
      '/src/app/shared/components/form-credential',
      '/src/app/shared/components/form-credential/form-credential.component.spec.ts',
      '/src/app/shared/components/popup',
      '/src/app/shared/components/power',
    ],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1'
    }
   };
   