FROM node:16-alpine as nest-app

RUN apk update && apk add curl

# RUN addgroup app && adduser -S -G app app

USER node
WORKDIR /home/app

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .

CMD ["npm", "run", "start:dev"]