FROM node:14

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE 8080

CMD [ "node", "dist/script.js" ]
