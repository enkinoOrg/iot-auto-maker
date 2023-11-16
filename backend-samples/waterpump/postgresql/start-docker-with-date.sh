echo '기존 도커 이미지를 삭제 하고 새로 빌드합니다.'
# docker-compose build --no-cache --force-rm --pull
docker-compose -p water-pump build 
echo '===================================='
echo '도커를 실행하여 워터펌프 인스탄스를 실행합니다.'
echo '시작 시간: ' $(date)
echo '===================================='
docker-compose -p water-pump up -d


echo '===================================='
echo '도커가 실행중입니다. 종료를 하려면 아래 명령어를 실행하세요.'
echo 'docker-compose -p water-pump down'
echo '===================================='

