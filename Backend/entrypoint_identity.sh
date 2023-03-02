#!/bin/bash

set -e
run_cmd="dotnet run --no-build --project Identity.App/Identity.App.csproj --environment Production --urls https://0.0.0.0:5001 -v d"

export PATH="$PATH:/root/.dotnet/tools"

cd ./Identity/Identity.App/
cat secrets.json | dotnet user-secrets set
cd ..

export ASPNETCORE_ENVIRONMENT=Production

until dotnet ef database update --project=Identity.Data/Identity.Data.csproj --startup-project=Identity.App/Identity.App.csproj --context=IdentityContext; do
    >&2 echo "Migrations executing"
    sleep 1
done

dotnet dev-certs https --clean
dotnet dev-certs https --trust

>&2 echo "DB Migrations complete, starting app."
>&2 echo "Running': $run_cmd"
exec $run_cmd