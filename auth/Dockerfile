# Use the official Node.js Alpine image as a base
FROM node:alpine

# Set the working directory in the Docker container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml (or package-lock.json if you're not using pnpm)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of your application's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the application in development mode
CMD ["pnpm", "run", "start:dev"]
