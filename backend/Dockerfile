FROM python:3.10

# set work directory
WORKDIR /code

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip 
COPY ./requirements.txt /code
RUN pip install -r requirements.txt

# copy project
COPY . .
COPY .env .env


CMD python main.py