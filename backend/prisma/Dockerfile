FROM node:lts

WORKDIR /app

RUN npm install -g prisma

ADD . ./prisma/

CMD ["prisma", "migrate", "deploy"]