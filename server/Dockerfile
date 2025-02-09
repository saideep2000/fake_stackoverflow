FROM node:18
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Compile TypeScript
RUN npm run build

# Expose API port (Important!)
EXPOSE 8000

# Run populate_db.ts script before starting the server
CMD node dist/populate_db.js && node dist/server.js