# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /course-managment-backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle the app source inside the Docker image
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the app
CMD [ "node", "./server.js" ]