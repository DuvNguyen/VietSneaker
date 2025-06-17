
update:
	- git pull
	- docker pull trungkieen/clockee-web:latest
	- docker pull trungkieen/clockee-server:latest

build:
	- docker-compose -f compose.prod.yaml up --build

stop:
	- docker-compose stop
