FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends aapt && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY backend/package.json ./
RUN npm install
COPY backend/ ./
RUN npm run build && cp src/db/*.sql dist/db/
RUN mkdir -p /data && chown node:node /data
USER node
CMD ["node", "dist/server.js"]
