FROM node:20-alpine

WORKDIR /usr/src/odin

COPY . /usr/src/odin

RUN npm install

RUN npm run build

ENTRYPOINT ["npm", "run"]