# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy everything (whole repo) into container
COPY . .

# Restore dependencies
RUN dotnet restore "api/InvoiceApp.API/InvoiceApp.API.csproj"

# Build and publish the app
RUN dotnet publish "api/InvoiceApp.API/InvoiceApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "InvoiceApp.API.dll"]
