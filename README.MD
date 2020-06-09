## This script for ecom database
## Usage
Before start script need to add columns at table users
``` 
ALTER TABLE users ADD first_name VARCHAR(255) NULL;
ALTER TABLE users ADD last_name VARCHAR(255) NULL;
```
Also, we need to create .env file. For example:
```
DB=ecom
USER=lonya
PASSWORD=
HOST=localhost
PORT=5432
```
Start
```
npm install
node psql.js


