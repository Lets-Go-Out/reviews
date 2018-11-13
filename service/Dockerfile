ARG MYSQL_ROOT_PASSWORD

FROM node:latest

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN npm install --production

EXPOSE 3005

CMD ["npm", "start"]