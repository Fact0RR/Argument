FROM pytorch/pytorch:2.1.0-cuda12.1-cudnn8-runtime

# Add requirements
ADD ./requirements.txt ./requirements.txt

# Install requirements
RUN pip install -r requirements.txt

# Add files
ADD . .

EXPOSE 5000

ENTRYPOINT ["python3", "main.py"]