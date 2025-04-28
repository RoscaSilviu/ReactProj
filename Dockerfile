# 1) build
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY src/ ./src
RUN npm install
COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# 2) serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
