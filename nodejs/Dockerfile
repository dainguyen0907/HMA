FROM node:20-alpine

WORKDIR /hma/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build-src

CMD [ "npm", "run", "build" ]