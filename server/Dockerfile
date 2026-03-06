# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

# Only install production dependencies
RUN npm install --omit=dev

# Copy only the compiled dist folder from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the API port
EXPOSE 4000

# Run the server
CMD ["npm", "start"]
