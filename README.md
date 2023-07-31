
# Подготовка
Создать файл `.env` перенести туда значения из `.env.example`, либо вызвать `cat .env.example > .env`

В `.env` файле нужно задать `ETHERSCAN_API_KEY`, можно использовать свой или воспользоваться моим `3KZ7JXD7XHWAHV4G5PYXHBA68B6XC7JNBI`, дальше вызываем:

1. ```docker build --tag "nestjs-api" .```
2. ```docker-compose up```

# Запуск
Запустить контейнеры, если не запущены

# Использование
В браузере перейти в swagger
```
localhost:3000/swagger
```

## P.S. 
Пытался реализовать cronjob через транзакции, но они почему-то не работают, просто весит `idle in transaction`. Было принято решение работать с базой через Repository.