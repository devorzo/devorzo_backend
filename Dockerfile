FROM node:12-slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm build
EXPOSE 5000
ENV NODE_ENV=production
ENV SERVICE=all
ENV MONGODB_URI=
CMD ["sh", "-c", "node /app/dist/app.js --env ${NODE_ENV} --service ${SERVICE}"]