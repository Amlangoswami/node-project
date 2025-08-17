# Use a minimal Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# App runs on port 3000 by default
ENV PORT=3000
EXPOSE 3000

# Run as non-root for safety
RUN addgroup -S app && adduser -S app -G app
USER app

CMD ["node", "server.js"]
