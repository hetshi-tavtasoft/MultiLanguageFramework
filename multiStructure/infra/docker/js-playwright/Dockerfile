FROM mcr.microsoft.com/playwright:v1.59.0-jammy

WORKDIR /app

COPY frameworks/js-playwright/package*.json ./

RUN npm ci

COPY frameworks/js-playwright/ ./

RUN npx playwright install

ENV ENV=qa

CMD ["npm", "test"]
