sudo docker exec epstep_web_1 python manage.py test --noinput epstep
sudo docker exec -it -u postgres  epstep_web_1 dropdb test_postgres
sudo docker exec -it epstep_web_1 python manage.py collectstatic
