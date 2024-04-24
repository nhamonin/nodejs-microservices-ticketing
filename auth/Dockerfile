# Use the official Node.js Alpine image as a base
FROM node:alpine

# Set the working directory in the Docker container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy your Prisma schema file
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of your application's source code
COPY . .

# Expose the application port and the debug port
EXPOSE 3000 9229

# Run the application in debug mode
CMD ["pnpm", "run", "start:debug"]
