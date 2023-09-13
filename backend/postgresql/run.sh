#!/bin/sh
echo "프로젝트 이름을 입력하세요"
read project_name
docker compose up -p $project_name -d