## Setup

git clone https://github.com/EbenBosman/eben-resume
cd eben-resume
npm install
```

## Development Workflow

### 1. Web Development (Frontend Only)
If you mainly want to edit the React components and styles:
```sh
npm run dev
```
- Opens the app at `http://localhost:3000`.
- **Note**: Features requiring the backend (like **PDF Resume Download** and **Contact Form**) will generally fail or show errors if the backend is not running.

### 2. Full Feature Testing (Frontend + Backend)
To test the **PDF Generation** or **Email Sending**:
1. Open a terminal and start the backend API:
   ```sh
   npm start
   ```
   *(Runs on `http://localhost:5000`)*

2. Open a **second terminal** and start the frontend:
   ```sh
   npm run dev
   ```
   *(Runs on `http://localhost:3000`)*

The frontend dev server is configured to proxy API requests (like `/pdf-resume`) to the backend on port 5000.

### 3. Production Build & Preview
To build the static assets and run the production server:
```sh
npm run server
```
- Builds the project for production.
- Starts the server at `http://localhost:5000`.

## Environment Variables
This project uses environment variables for configuration (e.g., SendGrid API keys).

1. The project includes a `.env` template file with the required keys but no values.
2. **Create a local configuration file**:
   ```sh
   cp .env .env.local
   ```
3. **Edit `.env.local`** and fill in your actual values (e.g., API keys).
4. **Note**: `.env.local` is git-ignored to prevent sensitive data from being committed. The application will load variables from `.env.local` first, falling back to `.env` for defaults.

## License

MIT
