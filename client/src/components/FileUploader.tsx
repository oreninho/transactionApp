import React, { useState } from 'react';
import Button from "./Button";

const FileUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setFile(event.target.files[0]);
        }
    };

    const onFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const response = await fetch('http://localhost:3000/transactions/upload', {
                method: 'POST',
                body: formData,
            });

            console.log(response); // Handle the response accordingly
        } catch (error) {
            console.error("An error occurred while uploading the file:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div key={"fileUploader"}>
            <h1>File Upload:</h1>
            <input type="file" onChange={onFileChange} />
            <Button onClick={onFileUpload} text={uploading?"uploading":"upload File"}/>
        </div>
    );
}

export default FileUploader;
