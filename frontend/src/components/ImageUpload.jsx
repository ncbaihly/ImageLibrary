import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon  from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const statusStyle = {
    display: 'block',
    margin: '1em',
}

const resStatus = Object.freeze({
    INITIAL: 'initial',
    UPLOADING: 'uploading',
    SUCCESS: 'success',
    ERROR: 'error',
});


const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [status, setStatus] = useState(resStatus.INITIAL);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
        setStatus(resStatus.INITIAL);
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImgPreview(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
    }
};

const handleCompressFile = async () => {
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8000/compressfile/', {
                method: 'POST',
                body: formData,
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `thumb_${file.name}`,
            );
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            URL.revokeObjectURL(url);
        } catch(error) {
            console.error(error);
        }
    }
}

const handleUpload = async () => {
    if (file) {
        setStatus(resStatus.UPLOADING);
    
        const formData = new FormData();
        formData.append('file', file);

        try {
            await fetch('http://localhost:8000/uploadfile/', {
                method: 'POST',
                body: formData,
            }).then((res) => {
                if(res.ok) {
                    setStatus(resStatus.SUCCESS);
                } else {
                    setStatus(resStatus.ERROR);
                }
            });
            
        } catch (error) {
            console.error(error);
            setStatus(resStatus.ERROR);
        }
    }
};


return (
    <>
        <div>
            <h1 style={{ textAlign: 'center' }}>Image Upload</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <div>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Select image
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                    />
                </Button>
            </div>
            {file && (
                <>
                    <div style={{ margin: '1em' }}>
                        <img alt="preview" src={imgPreview} height="128" width="128"/>
                    </div>
                    <div>
                        <Button variant="contained" onClick={handleCompressFile}>
                            Compress File
                        </Button>
                    </div>
                    <div>
                        <Box sx={{ margin: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Stack spacing={2}>
                                <Item>Name: {file.name}</Item>
                                <Item>Type: {file.type}</Item>
                                <Item>Size: {file.size} bytes</Item>
                            </Stack>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            className="submit"
                        >Upload image</Button>
                        <Result status={status} />
                    </div>
                </>
            )} 
            </div>
        </>
    );
};

const Result = ({ status }: { status: string }) => {
    if (status === resStatus.SUCCESS) {
        return (
            <Stack sx={statusStyle} alignItems="center" direction="row" gap={2}>
                <CheckCircleIcon />
                    <Typography variant="body1">File uploaded successfully!</Typography>
                </Stack>
        );
    } else if (status === resStatus.ERROR) {
        return (
            <Stack sx={statusStyle} alignItems="center" direction="row" gap={2}>
                <ErrorIcon />
                <Typography variant="body1">File upload failed!</Typography>
            </Stack>
        );
    } else if (status === resStatus.ERROR) {
        return (
            <Stack sx={statusStyle} alignItems="center" direction="row" gap={2}>
                <CloudSyncIcon />
                <Typography variant="body1">Uploading selected file...</Typography>
            </Stack>
        );
    } else {
        return null;
    }
}

export default ImageUpload;
