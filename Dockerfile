# Этап сборки
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.yarnpkg.com
RUN npm config set fetch-retry-maxtimeout 600000
RUN npm config set fetch-retry-mintimeout 10000
RUN npm config set fetch-retries 5
RUN npm cache clean --force
RUN npm install
COPY . ./
RUN npm run build

# Этап продакшена
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/build /app/build
COPY package*.json ./
RUN npm install --production
CMD ["npm", "start"]
