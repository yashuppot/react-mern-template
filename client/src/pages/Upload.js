import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        try {
            setUploading(true);
            await axios.post('http://localhost:5000/api/resumes/upload', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploading(false);
            navigate('/dashboard'); // Go to dashboard or leaderboard
        } catch (err) {
            console.error(err);
            setUploading(false);
            alert('Upload failed!');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="upload-container">
                <div className="upload-card">
                    <h2>Please Login to Upload</h2>
                    <p>You need to be signed in to upload your resume.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="upload-container">
            <div className="upload-card">
                <h1>Upload Your Resume</h1>
                <p>Join the battle and see how your resume ranks!</p>
                
                <form onSubmit={handleUpload} className="upload-form">
                    <div className="file-input-wrapper">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="file-label">
                            {file ? file.name : "Choose PDF File"}
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!file || uploading} 
                        className="upload-submit-btn"
                    >
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
