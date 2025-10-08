# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# Serve with Vite preview (simple, no SSR)
FROM node:20-alpine AS runtime
WORKDIR /app
ENV PORT=8080
EXPOSE 8080
COPY --from=build /app .
# Use Vite preview to serve dist on the provided PORT and 0.0.0.0
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT:-8080}"]



