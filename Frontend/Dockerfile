FROM node:16.14.2-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/app/dist/hostmusic /usr/share/nginx/html
RUN chown nginx:nginx /usr/share/nginx/html/*
EXPOSE 4200 80