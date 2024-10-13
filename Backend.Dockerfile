FROM python:3.12

WORKDIR /code

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./backend /code/backend

RUN chown -R appuser:appuser /code/backend/imgs
RUN chown -R appuser:appuser /code/backend/imgs/thumb
RUN chown -R appuser:appuser /code/backend/db.json

USER appuser

WORKDIR /code/backend

CMD ["fastapi", "run", "./main.py", "--port", "8000"]
