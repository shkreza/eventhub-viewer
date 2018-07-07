FROM node:carbon
MAINTAINER "Reza Sherafat Kazemzadeh"

WORKDIR /eventhubs-viewer-ts

COPY package*.json ./
RUN npm install

COPY . .
COPY static .
COPY dist .

EXPOSE 443
EXPOSE 4444

CMD [ "npm", "start" ]
