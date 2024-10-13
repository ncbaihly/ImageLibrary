from typing import Annotated
from fastapi import FastAPI, File, UploadFile, Response, status
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from tinydb import TinyDB, Query
from PIL import Image

import aiofiles, aiofiles.os
import logging, os, sys, json, io

app = FastAPI()

db = TinyDB('db.json')
CHUNK_SIZE = 1024 * 1024
IMAGE_PATH = './imgs'
THUMB_PATH = './imgs/thumb'


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter("%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s")
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*",]
        )

@app.get("/")
async def root():
    return {"message": "Image Library Backend Up"}


@app.get("/images/")
async def get_images():
    imageList = db.all()
    result = json.dumps(imageList)

    return Response(content=result)


@app.get("/image-thumb/{image_name}")
async def get_image_thumb(image_name: str):
    File = Query()
    result = db.search(File.name == image_name)

    if result:
        filepath = os.path.join(THUMB_PATH, os.path.basename(image_name))
        logger.info(f"Thumbnail found: {filepath}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='There was an error finding the thumbnail')
    
    return FileResponse(filepath, media_type="image/jpeg")


@app.get("/image/{image_name}")
async def get_photo(image_name: str):
    File = Query()
    result = db.search(File.name == image_name)

    if result:
        filepath = os.path.join(IMAGE_PATH, os.path.basename(image_name))
        logger.info(f"File found: {filepath}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='There was an error finding the file')

    return FileResponse(filepath, media_type="image/jpeg")


@app.post("/compressfile/", status_code=status.HTTP_200_OK)
async def compress_file(file: UploadFile = File(...)):
    contents = await file.read()
    thumb_image = Image.open(io.BytesIO(contents))
    thumb_image.thumbnail([128, 128], Image.Resampling.LANCZOS)

    result = io.BytesIO()
    thumb_image.save(result, format="jpeg")
    thumbname = "thumb_" + file.filename
    headers = {'Content-Disposition': f'attachment; filename="{thumbname}"'}
    logger.info(headers)

    return Response(result.getvalue(), headers=headers, media_type="image/jpeg")


@app.post("/uploadfile/", status_code=status.HTTP_201_CREATED)
async def create_upload_file(file: UploadFile):
    filepath = os.path.join(IMAGE_PATH, os.path.basename(file.filename))
    thumb_filepath = os.path.join(THUMB_PATH, os.path.basename(file.filename))
    File = Query()
    
    if db.search(File.name == file.filename):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Image with same name already exists')

    try:
        async with aiofiles.open(filepath, 'wb') as f:
            while chunk := await file.read(CHUNK_SIZE):
                await f.write(chunk)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='There was an error uploading the file')
    finally:
        await file.close()
    
    try:
        thumb_image = Image.open(filepath)
        thumb_image.thumbnail([128, 128], Image.Resampling.LANCZOS)
        thumb_image.save(thumb_filepath, "JPEG")
    except IOError:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='There was an error creating the thumbnail') 
    db.insert({
        'name': file.filename,
        'contentType': file.content_type,
        'path': f"{IMAGE_PATH}/{file.filename}",
        'thumb_path': f"{THUMB_PATH}/{file.filename}",
        })

    return FileResponse(thumb_filepath, media_type="image/jpeg") 


@app.delete("/deletefile/{filename}")
async def delete_file(filename: str):
    File = Query()
    result = db.search(File.name == filename)

    if result:
        try:
            filepath = os.path.join(IMAGE_PATH, os.path.basename(filename))
            thumb_filepath = os.path.join(THUMB_PATH, os.path.basename(filename))
            await aiofiles.os.remove(filepath)
            await aiofiles.os.remove(thumb_filepath)
        except Exception:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail='There was an error deleting the file')
        finally:
            db.remove(File.name == filename)

    return {"message": f"Successfully deleted {filename}"}
