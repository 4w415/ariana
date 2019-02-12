# Installation
Use a virtual environment and activate it.
```
virtualenv3 -p /usr/bin/python3.x .venv/
source .venv/bin/activate
```

After activating your environment, you can install python libraries by typing the following.
```
pip install -r requirements.txt
```

## PostgresQL Database
Create database and user role that django will use to connect to database on startup. Following is the general guideline to create database & user role in postgres.
```
sudo -u postgres psql
postgres=# create database mydb;
postgres=# create user myuser with encrypted password 'mypass';
postgres=# grant all privileges on database mydb to myuser;
```

Once you have your desired database and user role created, you'll have to add the required information in your environment variables. For example, you can create a **`.env`** file in your workspace with following content.
```
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=<your-username>
export DB_PASS=<your-password>
export DB_NAME=<your-database-name>
```
Replace **`<your-username>`**, **`<your-password>`** and **`<your-database-name>`** with appropriate values you used in your postgres. Similarly, if your postgres is not on localhost or running on a different port than default `5432` port, then use the working values for **`DB_HOST`** and **`DB_PORT`**, respectively.

## Fixtures & Migrations
You will need to migrate the database schema as well as run the fixtures to feed initial data automatically to make things work as expected.
```
python manage.py migrate
python manage.py loaddata 00_users.json
python manage.py loaddata 01_questionnaires.json
```