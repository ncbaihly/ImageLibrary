import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Modal from '@mui/material/Modal';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '90vh',
    width: '75%',
    height: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
};

class Image {
    blob;
    thumbUrl;
    url;

    constructor(blob, thumbUrl, url) {
        this.blob = blob;
        this.thumbUrl = thumbUrl;
        this.url = url;
    }
}

const backendURL = 'http://localhost:8000/';
const fullResPath = 'image/';
const thumbPath = 'image-thumb/';
const imagesPath = 'images';

function Homepage() {
    const [imgs, setImgs] = useState([]);
    const [open, setOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(-1);
    const handleOpen = (index) => {
        setOpen(true);
        setActiveModal(index);
    };
    const handleClose = () => {
        setOpen(false);
        setActiveModal(-1);
    }

    const fetchImgs = useCallback (async () => {
            const res = await fetch(`${backendURL}${imagesPath}`);
            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }
            const imgList = await res.json();
            const blobArray = [];

            for (let obj in imgList) {
                const thumbUrl = `${backendURL}${thumbPath}${imgList[obj].name}`;
                const url = `${backendURL}${fullResPath}${imgList[obj].name}`
                const imgRes = await fetch(thumbUrl);
                const imageBlob = await imgRes.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                const img = new Image(imageObjectURL, thumbUrl, url);
                blobArray.push(img);
            }
            setImgs([...blobArray]);
        }, []);

    useEffect(() => {
        fetchImgs();
    }, [fetchImgs]);

    return (
        <div>
            <style>{`img.thumb:hover{outline: 4px solid #1976d2;}`}</style>
            <h1 style={{textAlign: 'center'}}>Welcome to the Image Library</h1>
            <Grid container sx={{display: 'flex', justifyContent: 'center'}} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md:2 }}>
            {imgs.map((obj, i) =>
                <div key={i}>
                    <Modal 
                        open={open && i === activeModal}
                        onClose={handleClose}
                        aria-labelledby={`modal-${obj.name}`}
                        aria-describedby={`modal-${obj.name}-fullres`}
                    >
                        <Box sx={style} onClick={handleClose}>
                            <img
                                src={obj.url} style={{ width: '100%', height: 'auto' }} 
                                alt={`fullres_${obj.name}`} 
                            />
                        </Box>
                    </Modal>
                    <Grid size={2} onClick={() => handleOpen(i)} ><img classname="thumb" src={obj.blob} alt={i} /></Grid>
                </div>
            )}
            </Grid> 
        </div>
    );
}

export default Homepage;
