FROM node:22-alpine

RUN apk add --no-cache openssl libstdc++ git python3 make g++ bash

# Create a non-root user and group
RUN addgroup -S development && adduser -S devadmin -G development

WORKDIR /usr/src/app

COPY . .

RUN npm install --ignore-scripts && \
    npm run db:client && \
    npm run db:deploy && \
    npm run db:seed && \
    npm run build && \
    npx prisma generate

# Change ownership of the app directory
RUN chown -R devadmin:development /usr/src/app

# Switch to the non-root user
USER devadmin

EXPOSE 3000

CMD [ "node", "dist/server.js" ]