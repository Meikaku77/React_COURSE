# JEST Y REACT TESTING LIBRARY

> npm i -D @testing-library/react @testing-library/jest-dom

> npm i -D jest jest-environment-jsdom

- Creo jest.config.cjs

~~~js
module.exports = {
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
}
~~~

- Creo jest.setup.js

~~~js
import '@testing-library/jest-dom'
~~~

- Añado una nueva linea al jest.config.cjs

~~~js
module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
~~~

- scripts  en package.json

~~~js
    "test": "jest",
    "coverage": "jest --coverage"
~~~

> npm i -D babel-jest @babel/preset-env @babel/preset-react

- En babel.config.cjs

~~~js
module.exports={
    presets: [
        "@babel/preset-env",
        ["@babel/preset-react", {runtime: "automatic"}]
    ]
}
~~~
