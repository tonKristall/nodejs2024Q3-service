FROM node:22.9.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE ${PORT}
CMD ["npm", "run", "docker:start"]
