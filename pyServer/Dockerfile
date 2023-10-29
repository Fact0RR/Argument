FROM pytorch/pytorch:2.1.0-cuda12.1-cudnn8-runtime

# Add requirements
ADD ./requirements.txt ./requirements.txt

# Install requirements
RUN pip install -r requirements.txt

# Add files
ADD ./server.py ./server.py
ADD ./test ./test
ADD ./tracking.py ./tracking.py

RUN apt update \
    && apt install -y ffmpeg libsm6 libxext6

EXPOSE 5000

ENTRYPOINT ["python3", "server.py"]