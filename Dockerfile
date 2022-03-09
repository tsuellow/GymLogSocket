FROM node

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3005

CMD ["npm","start"]