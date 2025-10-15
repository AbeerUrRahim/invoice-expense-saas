# Stage 1: Build .NET project
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj file and restore dependencies
COPY ./api/InvoiceApp.API/InvoiceApp.API ./api/InvoiceApp.API/
RUN dotnet restore "./api/InvoiceApp.API/InvoiceApp.API"

# Copy the rest of the source code
COPY ./api/InvoiceApp.API/ ./api/InvoiceApp.API/

# Publish the app
RUN dotnet publish "./api/InvoiceApp.API/InvoiceApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "InvoiceApp.API.dll"]
