FROM node:18-alpine
WORKDIR /app
COPY ./frontend/package.json .
RUN yarn install

COPY ./frontend/public ./public
COPY ./frontend/src ./src
COPY ./frontend/yarn.lock ./yarn.lock

CMD ["yarn", "start", "--port", "3000"]

