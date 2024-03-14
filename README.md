# Ecommerce Api

The Ecommerce API is designed to power ecommerce platforms with essential features such as authentication, authorization, product management, order processing, and cart management.

## Getting Started
To get started with this project, follow the steps below:

1. Clone the repository:
git clone https://github.com/samresh9/e-commerce.git

2. Install dependencies:
`npm install`

3. Clone `sample.env` file at the root of your project to create `.env` file.

4. Start the project:
- For running in development mode :
  ```
  npm run start:dev
  ```

- For running in production mode:
  ```
  npm run start:prod
  ```


## API Reference

### Base URL
The base URL for all API endpoints is http://localhost:3000 
### Api Documentation
The URL for API documentation with Swagger: http://localhost:3000/api/docs



### Git Hooks and Husky

We utilize Husky, a Git hook tool, to enforce certain actions and maintain a consistent workflow within our project. Git hooks are scripts that run before or after specific Git events.



- **Pre-commit Hook**: We have setup the pre-commit hook that runs code formatting scripts and linters to ensure code consistency before committing changes.

Please ensure that your code meets the required standards and passes the necessary checks before committing or pushing changes.

---

### Environment Variables

Certain parts of our application require the presence of environment variables for proper configuration. These variables are typically stored in a `.env` file at the root of the project.

Before running the project locally, make sure to create a `.env` file and you can clone the `sample.env` and fill your value accordingly. Log related configuration have default value, therefore do not require values from .env.

