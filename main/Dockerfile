# Base image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install -g npm@9.8.1
RUN npm install --legacy-peer-deps
# RUN npm install

# Add any other environment variables you need
RUN npm run build

# Expose the port that the Nest.js application listens on (if applicable)
EXPOSE 8080

# Start the app
CMD [ "npm", "run", "start:prod" ]
