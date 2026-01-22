FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/SevenStones.Server ./SevenStones.Server
RUN dotnet restore SevenStones.Server/SevenStones.Server.csproj
RUN dotnet publish SevenStones.Server/SevenStones.Server.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Copy frontend into wwwroot so ASP.NET serves it
COPY frontend ./wwwroot

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "SevenStones.Server.dll"]
