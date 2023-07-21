# Base image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@9.8.0
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY ./.env.production ./.env

# Add any other environment variables you need
RUN npm run build

# Expose the port that the Nest.js application listens on (if applicable)
EXPOSE 8080

# Start the app
CMD [ "npm", "run", "start:prod" ]
