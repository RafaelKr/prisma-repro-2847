#!/usr/bin/env bash

source /scripts/env-data.sh

if [ -z "${ALTER_EXTENSIONS}" ]; then
	ALTER_EXTENSIONS=$POSTGRES_MULTIPLE_EXTENSIONS
fi

if [ -z "${ALTER_EXTENSION_DB}" ]; then
  # first db
	ALTER_EXTENSION_DB=$(echo ${POSTGRES_DBNAME} | cut -f 1 -d ",")
fi

if [ -z "${ALTER_EXTENSION_SCHEMA}" ]; then
  # first schema
	ALTER_EXTENSION_SCHEMA=$(echo ${SCHEMA_NAME} | cut -f 1 -d ",")

  if [ -z "${ALTER_EXTENSION_SCHEMA}" ]; then
    # first db
	  ALTER_EXTENSION_SCHEMA=$ALTER_EXTENSION_DB
  fi
fi

echo "ALTER_EXTENSIONS: $ALTER_EXTENSIONS";
echo "ALTER_EXTENSION_DB: $ALTER_EXTENSION_DB";
echo "ALTER_EXTENSION_SCHEMA: $ALTER_EXTENSION_SCHEMA";

for ext in $(echo ${ALTER_EXTENSIONS} | tr ',' ' '); do
    if [[ ${ext} != 'pg_cron' ]]; then
      su - postgres -c "psql -c \"UPDATE pg_extension SET extrelocatable = true WHERE extname = '${ext}'; ALTER EXTENSION $ext SET SCHEMA $ALTER_EXTENSION_SCHEMA;\" $ALTER_EXTENSION_DB"
    fi
done

