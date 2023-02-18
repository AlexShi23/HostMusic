#!/bin/bash

set -e
run_cmd="dotnet run --no-build --project Releases/Releases.App/Releases.App.csproj --urls http://0.0.0.0:5283 -v d"

export PATH="$PATH:/root/.dotnet/tools"

cd ./Releases/Releases.Data/

until dotnet ef database update --project=Releases.Data/Releases.Data.csproj --startup-project=Releases.App/Releases.App.csproj --context=ReleasesContext; do
    >&2 echo "Migrations executing"
    sleep 1
done

>&2 echo "DB Migrations complete, starting app."
>&2 echo "Running': $run_cmd"
exec $run_cmd