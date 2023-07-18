# Use a base image with Node.js pre-installed
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/api

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install --quiet --no-optional --no-fund

# Install the application dependencies
RUN npm build

# Copy the source code to the working directory
COPY . .

# Expose the port on which the Nest.js application will listen
EXPOSE 3000

# Start the Nest.js application
CMD [ "npm","run" ,"start:prod"]