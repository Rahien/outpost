FROM --platform=$BUILDPLATFORM python:3.11-bullseye
EXPOSE 8000
WORKDIR /app
RUN apt update
RUN apt install -y python3-pip python3-dev libpq-dev postgresql postgresql-contrib libsnappy-dev
COPY requirements.txt /app
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /app
ENTRYPOINT ["python3"]

CMD ["manage.py", "runserver", "0.0.0.0:8000"]
