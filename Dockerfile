FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build

# Copy static files
COPY public ./public
COPY src/resources ./src/resources

# Expose port
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ] 