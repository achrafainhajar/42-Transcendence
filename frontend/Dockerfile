FROM node:lts 

WORKDIR /app

ARG IP_HOST
ARG FRONTPORT

COPY package*.json ./

RUN npm i

COPY . .


RUN sed -i "s/localhost/$IP_HOST/g" ./src/constants.ts
#RUN sed -i 's/localhost:3000/back.solarsteamgenerator.com/g' ./src/constants.ts

CMD ["npm", "run" ,"dev"]