FROM node:18

RUN apt-get update && apt-get install -y mongodb-server

RUN mkdir -p /data/db

RUN apt-get install -y caddy

WORKDIR /app

RUN cd /app/frontend && yarn install

ENV MONGODB_URI="mongodb://localhost:27017/baituan"
ENV JWT_SECRET=""
ENV API_PORT=3001
ENV GLOT_IO_API_KEY=""

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443

CMD service mongodb start && cd /app && yarn start
