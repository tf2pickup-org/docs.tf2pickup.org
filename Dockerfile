FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Deployment step

FROM busybox:1.38 as deploy

RUN adduser -D static
USER static
WORKDIR /home/static

COPY --from=build /usr/src/app/build/ ./

LABEL org.opencontainers.image.version="latest" \
      org.opencontainers.image.title="docs-tf2pickup-org" \
      org.opencontainers.image.base.name="ghcr.io/tf2pickup-org/docs.tf2pickup.org:latest" \
      org.opencontainers.image.description="tf2pickup.org documentation" \
      org.opencontainers.image.source="https://github.com/tf2pickup-org/docs.tf2pickup.org"

EXPOSE 3100

CMD ["busybox", "httpd", "-f", "-v", "-p", "3100"]