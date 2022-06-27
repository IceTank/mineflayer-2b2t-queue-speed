FROM node:16-slim

WORKDIR /src/app
COPY package.json .
RUN yarn
COPY . .

CMD ["npm", "run", "standalone"]