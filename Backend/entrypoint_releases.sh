#!/bin/bash

set -e
run_cmd="dotnet run --no-build --project Releases.App/Releases.App.csproj --environment Production --urls https://0.0.0.0:7283 -v d"

export PATH="$PATH:/root/.dotnet/tools"

cd ./Releases/Releases.App/
cat secrets.json | dotnet user-secrets set
cd ..

export ASPNETCORE_ENVIRONMENT=Production

until dotnet ef database update --project=Releases.Data/Releases.Data.csproj --startup-project=Releases.App/Releases.App.csproj --context=ReleasesContext; do
    >&2 echo "Migrations executing"
    sleep 1
done

dotnet dev-certs https --clean
dotnet dev-certs https --trust

>&2 echo "DB Migrations complete, starting app."
>&2 echo "Running': $run_cmd"
exec $run_cmd