from node:4

RUN npm install -g npm
RUN npm install -g typescript@1.6.2 bower gulp node-gyp
RUN apt-get update && apt-get install libkrb5-dev

EXPOSE 3002:3002
RUN mkdir /app
WORKDIR /app
COPY ./ /app/
RUN ./updateAll.sh
WORKDIR /app/example
CMD node server.js