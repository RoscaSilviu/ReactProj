# backend/Dockerfile
FROM node:16-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app

# install all deps (incl. sequelize-cli if in devDependencies)
COPY package*.json ./
RUN npm ci

FROM node:16-alpine
WORKDIR /app

# copy deps + code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

CMD ["npm", "start"]