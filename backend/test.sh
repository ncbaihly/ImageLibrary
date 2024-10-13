#! /bin/bash
echo "Test base URL first"
echo "$(curl http://127.0.0.1:8000)"
echo "Test photo get"
echo "$(curl http://127.0.0.1:8000/photo/1)"
echo "$(curl -X "DELETE" http://localhost:8000/deletefile/2.jpg)"

curl \                                              
-F filename="1.jpg" \
-F content_type="image/jpeg" \
-F file=@/home/nate/Documents/code/imagesToUpload/1.jpg \
http://localhost:8000/uploadfile/
  
