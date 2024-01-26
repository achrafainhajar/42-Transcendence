FROM node:lts 

WORKDIR /app

COPY . .

RUN npm install && npm run build

CMD npm run start:prod


#FROM node:lts AS builder
#WORKDIR /app
#COPY package*.json ./
#COPY prisma ./prisma/
#COPY protos ./protos/
#COPY tsconfig.build.json ./
#COPY tsconfig.json ./
#RUN npm install
#RUN npm run build
#COPY . .

#FROM node:lts-alpine
#COPY --from=builder /app/node_modules ./node_modules/
#COPY --from=builder /app/package*.json ./
#COPY --from=builder /app/dist ./dist/
#COPY --from=builder /app/protos ./protos/
#COPY --from=builder /app/tsconfig.build.json ./
#COPY --from=builder /app/tsconfig.json ./
#COPY --from=builder /app/prisma ./prisma/
#EXPOSE 5273
#CMD ["npm", "run", "start:prod"]