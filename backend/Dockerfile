# Start with a lightweight, pre-configured Node.js computer
FROM node:18-alpine

# Create a folder inside the container to hold the app
WORKDIR /app

# Copy our package list and install the dependencies
COPY package*.json ./
RUN npm install

# Copy all the actual code into the container
COPY . .

# Open up port 5000 so the container can communicate with the outside world
EXPOSE 5000

# The command to wake up the server when the container starts
CMD ["npx", "ts-node", "server.ts"]