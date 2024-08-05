FROM node:18.14-alpine

WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache \
    build-base \
    openssl \
    libssl1.1

RUN npm install --global prisma

COPY package.json ./
RUN if [ -f package-lock.json ]; then cp package-lock.json ./; \
    elif [ -f yarn.lock ]; then cp yarn.lock ./; \
    fi

RUN npm install --frozen-lockfile

COPY . .