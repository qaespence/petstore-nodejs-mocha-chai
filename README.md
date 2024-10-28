# petstore-nodejs-mocha-chai
Swagger PetStore API testing framework, written in NodeJS, using Mocha and Chai

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 20.18.0 or higher)
- [npm](https://www.npmjs.com/)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/qaespence/petstore-nodejs-mocha-chai.git
cd petstore-nodejs-mocha-chai
```

### 2. Install dependencies

After cloning the repository, install the required dependencies using npm:
```bash
npm install
```

## Running the Tests

### 1. Run all tests

To run the entire test suite, execute the following command:
```bash
npm test
```
This will run all the test files recursively from the test/specs folder.

### 2. Run specific test files

To run a specific test file, for example, the pet.js test file:
```bash
npx mocha test/specs/pet.js
```

### 3. Run specific tests

To run a specific tests, for example, the Pet Create tests:
```bash
npm test -- -g "Test pet create"
```

## Folder Structure

Here’s a description of the project’s folder and file structure:
```
.
├── test/                       # Main test folder containing all test-related files
│   ├── api/                    # Contains API request functions
│   │   ├── basicRequests.js    # Contains core request methods (POST, GET, PUT, DELETE)
│   │   └── schemaDB.json       # Expected schema responses
│   ├── helpers/                # Contains utility functions
│   │   └── utils.js            # Utility functions (e.g., logging, clearing logs, etc.)
│   ├── logs/                   # Stores log files for each test suite
│   └── specs/                  # Contains all the test cases for different API endpoints
│       └── pet.js              # Test cases for the /pet API endpoints
├── .gitignore                  # Files and folders to ignore in Git
├── .mocharc.js                 # Mocha configuration file
├── package-lock.json           # Project dependencies
├── package.json                # Project dependencies and scripts
└── README.md                   # Project instructions and documentation (this file)
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.
