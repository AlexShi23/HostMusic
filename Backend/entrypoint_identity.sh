#!/bin/bash

set -e
run_cmd="dotnet run --no-build --project Identity/Identity.App/Identity.App.csproj --urls http://0.0.0.0:5000 -v d"

export PATH="$PATH:/root/.dotnet/tools"

cd ./Identity/Identity.Data/

until dotnet ef database update --project=Identity.Data/Identity.Data.csproj --startup-project=Identity.App/Identity.App.csproj --context=IdentityContext; do
    >&2 echo "Migrations executing"
    sleep 1
done

>&2 echo "DB Migrations complete, starting app."
>&2 echo "Running': $run_cmd"
exec $run_cmd