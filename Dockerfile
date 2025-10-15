# Use .NET 6 SDK image to build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ./api/InvoiceApp.API/InvoiceApp.API.csproj ./InvoiceApp.API/
RUN dotnet restore "InvoiceApp.API/InvoiceApp.API.csproj"

# Copy the rest of the source code
COPY ./api/InvoiceApp.API/ ./InvoiceApp.API/

# Build and publish the app
RUN dotnet publish "InvoiceApp.API/InvoiceApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use .NET 6 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "InvoiceApp.API.dll"]
