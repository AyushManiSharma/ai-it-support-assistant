# Start with the lightweight Node.js computer
FROM node:18-alpine

WORKDIR /app

# Copy the package list and install dependencies
COPY package*.json ./
RUN npm install

# Copy the React code
COPY . .

# Open up port 3000 for the user interface
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]