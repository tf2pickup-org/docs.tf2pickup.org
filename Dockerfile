FROM node:26 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Deployment step

FROM dhi.io/nginx:1.31-debian13 AS deploy

COPY --from=build /usr/src/app/build/ /usr/share/nginx/html/

LABEL org.opencontainers.image.version="latest" \
      org.opencontainers.image.title="docs-tf2pickup-org" \
      org.opencontainers.image.base.name="ghcr.io/tf2pickup-org/docs.tf2pickup.org:latest" \
      org.opencontainers.image.description="tf2pickup.org documentation" \
      org.opencontainers.image.source="https://github.com/tf2pickup-org/docs.tf2pickup.org"
