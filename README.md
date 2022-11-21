<p align="center">
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sword-logo-blue.svg/2880px-Sword-logo-blue.svg.png"
    width="400"
    alt="Sword Logo" />
</p>

# Sword Technical Challenge

## How to run
After cloning the project from this repository:

1. Install system dependencies:
```bash
npm i
```

2. Create a file named `.env` in the root of the project with the following
content:
```YAML
# MISC
APP_PORT=3001
BCRYPT_ROUNDS=15
ENCRYPTION_KEY_PASSWORD=4ebb1067bf75c6819980ae1f69a6172e87daf9a32d8deec00f30d35a6ecbe34a

# JWT
JWT_SECRET=905a070622725cca8d4d112d756de636183e8c5e
JWT_EXP_PERIOD=1h

# MySQL
MYSQL_HOSTNAME=localhost
MYSQL_PORT=3306
MYSQL_DB_NAME=shc-db
MYSQL_USER_NAME=shc-api-mysql-user
MYSQL_USER_PSWD=c66Gd?W.H:-8NSq4
MYSQL_ROOT_PSWD=S9J}papus?Qo9q)N

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_NOTIFICATION_QUEUE=task_notification

```

3. Run the environment.
```bash
docker-compose up -d
```
Both MySQL and RabbitMQ services must be running after this step but you may
have to wait a minute or to until the services are fully available.

4. Run all migrations.
```bash
npm run migration:run
```

5. Run the project.
```bash
npm run start
```
If you don't have webpack installed globally, you may have to run the following
command first:
```bash
npm link webpack
```

## Documentation
API documentation is available at [`/api`](http://localhost:3001/api) endpoint
in OpenAPI (Swagger) format.

## Postman
There are Postman files inside the `postman` directory in the root of the
project that can be used for testing.

There are two users already created for testing:

A `MANAGER`:
```JSON
{
  "username": "Marcus Aurelius",
  "password": 14159265
}
```

And a `TECHNICIAN`:
```JSON
{
  "username": "Julius Caesar",
  "password": 14159265
}
```

You can also create a new user through the `POST /user` endpoint.

## RabbitMQ
To check RabbitMQ queues, access the
[management console](http://localhost:15672/) with the following credentials:

```Plain text
username: guest
password: guest
```
