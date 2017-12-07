sudo docker exec b6e404f74eb5 python manage.py test --noinput epstep
sudo docker exec -it -u postgres  09cda61ee880 dropdb test_postgres
