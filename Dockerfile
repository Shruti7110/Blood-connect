FROM node:20-slim

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

COPY . .

# Build the Node.js application (compiles TypeScript)
RUN npm run build

# Create a non-root user for Python dependencies
RUN adduser --system --group --shell /bin/sh appuser
USER appuser

EXPOSE 3000

CMD ["npm", "run", "start"]

