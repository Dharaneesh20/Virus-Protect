import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const FileUpload = ({ setScanResult, setLoading, loading }) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Direct upload to our server
            const response = await axios.post('http://localhost:5000/api/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // If queued, we might need to poll, but for now assuming we get immediate result or an ID to poll
            // Our backend returns the full report if found, OR { status: 'queued', analysisId: ... }

            const data = response.data;

            if (data.status === 'queued') {
                // Poll for results
                pollForResults(data.analysisId);
            } else {
                setScanResult(data);
                setLoading(false);
            }

        } catch (error) {
            console.error('Upload failed', error);
            setLoading(false);
            alert('Error scanning file. See console.');
        }
    }, []);

    const pollForResults = async (analysisId) => {
        let attempts = 0;
        const maxAttempts = 20; // 40 seconds (approx)

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await axios.get(`http://localhost:5000/api/analysis/${analysisId}`);
                const status = res.data.data.attributes.status;

                if (status === 'completed') {
                    clearInterval(interval);
                    // We need to fetch the file report now, often using the fileSHA256 from analysis
                    // But actually the analysis object contains the stats we need usually
                    setScanResult(res.data);
                    setLoading(false);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    alert('Scan timed out. Please check VirusTotal manually.');
                    setLoading(false);
                }
            } catch (e) {
                console.error('Polling error', e);
            }
        }, 2000);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

    return (
        <div
            {...getRootProps()}
            className={`
        w-full max-w-xl h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragActive
                    ? 'border-neon-green bg-neon-green/10 scale-105'
                    : 'border-gray-600 hover:border-neon-green hover:bg-white/5'}
      `}
        >
            <input {...getInputProps()} />

            {loading ? (
                <div className="flex flex-col items-center animate-pulse text-neon-green">
                    <FaSpinner className="text-5xl animate-spin mb-4" />
                    <p className="text-xl font-mono tracking-widest">SCANNING SYSTEM...</p>
                    <p className="text-xs text-gray-500 mt-2">ENCRYPTING UPLOAD STREAM</p>
                </div>
            ) : (
                <>
                    <FaCloudUploadAlt className={`text-6xl mb-4 transition-colors ${isDragActive ? 'text-neon-green' : 'text-gray-400'}`} />
                    <p className="text-xl text-center font-bold text-gray-300 mb-2">
                        {isDragActive ? "DROP FILE TO INITIATE SCAN" : "DRAG & DROP LOCAL FILE"}
                    </p>
                    <p className="text-sm text-gray-500">OR CLICK TO BROWSE FILESYSTEM</p>
                </>
            )}
        </div>
    );
};

export default FileUpload;
