FROM node:12-alpine

COPY package*.json ./

ARG NPM_REGISTRY_URL
ARG NPM_CAFILE_URL

RUN if [ "x$NPM_REGISTRY_URL" = "x" ] ; then echo "Using default npm registry" ; else echo "Setting registry to $NPM_REGISTRY_URL" && npm config set registry ${NPM_REGISTRY_URL} ; fi
RUN if [ "x$NPM_CAFILE_URL" = "x" ] ; then echo "No CA file set for npm registry" ; else echo "$NPM_CAFILE_URL" && curl "$NPM_CAFILE_URL" > ~/CA.crt && npm config set cafile ~/CA.crt ; fi

RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
