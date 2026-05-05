FROM mcr.microsoft.com/playwright:v1.59.0-jammy

WORKDIR /app

COPY frameworks/ts-playwright/package*.json ./

RUN npm ci

COPY frameworks/ts-playwright/ ./

RUN npx playwright install

ENV ENV=qa

CMD ["npx", "playwright", "test"]
