FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build

WORKDIR /src

COPY frameworks/csharp-playwright/csharp-playwright.csproj ./
RUN dotnet restore

COPY frameworks/csharp-playwright/ ./
RUN dotnet build -c Release -o /app/build

FROM mcr.microsoft.com/playwright:v1.59.0-jammy

WORKDIR /app

COPY --from=build /app/build ./

RUN pwsh playwright.ps1 install --with-deps

ENV ENV=qa

CMD ["dotnet", "test", "--no-build", "--verbosity", "normal"]
