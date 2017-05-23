FROM node:6.9.1-alpine

WORKDIR /root/

COPY package.json   .

RUN npm i
COPY index.js       .

CMD ["node", "index.js"]

