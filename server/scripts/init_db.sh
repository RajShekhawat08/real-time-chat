#!/bin/bash

source ../../.env
psql -h "${DB_HOST}" -p "${DB_PORT}" -U postgres <<EOF

CREATE ROLE app_user WITH LOGIN PASSWORD '${DB_PASSWORD}';
CREATE DATABASE realtimechat_db OWNER app_user;
EOF