# ImageLibrary

## How to run
Simply run `docker compose up` in the root project directory. The projects can
also be run separately. For the backend `fastapi dev main.py` from `./backend`
folder(make sure to have activated the virtual environment). For the frontend
in `./frontend` run `yarn install` and `yarn start`.

## Introduction
I started with working on the backend to get the API working. I decided to use
TinyDB as my json database since it seemed simple to use. When I started I had the
upload route save compressed version of the uploaded file for simplicity. In addition
I made a route to get the compressed files with the intention of displaying them 
as a gallery in the frontend. I later added a function to get a compressed version 
of the file without saving the file so the user could see the result before 
uploading. I used `curl` to verify the API routes were working.

When starting on the React app, I first got the basics working before 
adding styling and other functionality. Starting with just displaying the
images and uploading a file. For the gallery I added a route to the backend to get
the list of files from the database and then load the corresponding files.

## Things that could be better
I knew I had limited time, so I decided to stick with inline styling for simplicity, 
although its not really best practice. In addition I didn't add add environment variables
and just wrote/composed the URLs I needed to call from the frontend. There also
might be some corner cases I missed, in particular displaying vertical images. 
I'm not too sure how well the application will handle large amounts of pictures or traffic.

Also some of the components might ideally be broken down into smaller piececes.
The way that downloading the compressed file handled is a bit hacky, there is probably
a much better solution out there. In addition in might be better to get the filename
by allowing the React app to see Header information by adding `Access-Control-Allow-Headers`
to the backend response.

In order to get the dockerized version working I set `allow_origins=["*"]` in the
backend, obviously this is not something this should be done for a production application.
I also haven't work with Python since college so I'm not sure how well I followed
best practices with Python specific details. The FastApi documentation was well written
though which was very helpful and had many examples.

## Additional possible features
 Also the image display is very simple, it would be nice to have some
paging/lazy loading instead of trying to load all the images stored in the database.
Multiple image upload could also be a useful feature. Another feature I thought about
adding was buttons in the gallery to download the full res or thumbnail version of
each image. If a lot of images were to be stored, having a tag and search system
would make lookup more convenient.

## Conclusion
Thank you for taking a look at this project!


