FROM node:12-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci \
 && npm cache clean --force \
 && npm install

COPY . .

CMD ["npm", "start"]