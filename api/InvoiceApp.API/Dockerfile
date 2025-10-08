# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# copy solution and restore
COPY InvoiceApp.API.csproj ./
RUN dotnet restore "InvoiceApp.API.csproj"

# copy rest of the source
COPY . .
RUN dotnet publish "InvoiceApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
# Railway provides PORT; map it to ASP.NET if present
ENV PORT=8080
EXPOSE 8080

COPY --from=build /app/publish .

# pass through envs commonly used on Railway (optional)
ENV DOTNET_RUNNING_IN_CONTAINER=true

ENTRYPOINT ["dotnet", "InvoiceApp.API.dll"]



