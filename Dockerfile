# Use the official Node.js image with a specific version of Node.js
FROM node:20.13.1-alpine3.20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install all dependencies including devDependencies to compile TypeScript code
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]
