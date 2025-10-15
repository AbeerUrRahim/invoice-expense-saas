# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY api/InvoiceApp.API/InvoiceApp.API.csproj ./api/InvoiceApp.API/
RUN dotnet restore "api/InvoiceApp.API/InvoiceApp.API.csproj"

# Copy the rest of the source code
COPY api/InvoiceApp.API/ ./api/InvoiceApp.API/

# Build and publish the app
RUN dotnet publish "api/InvoiceApp.API/InvoiceApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "InvoiceApp.API.dll"]
