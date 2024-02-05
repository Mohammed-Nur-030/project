import React, { useState } from 'react';
import Cookies from 'js-cookie';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [siteURL, setSiteURL] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

 

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    formData.append('siteURL', siteURL);

    try {
      const response = await fetch('/api/readfile', {
        method: 'POST',
        body: formData,
        headers: {
          // Remove the 'Content-Type' header, as it's set automatically for FormData
          'X-Site-URL': siteURL, // Add the siteURL to the headers
        },
      });

      if (!response.ok) {
        // Handle the response if it's not OK (e.g., 4xx or 5xx status codes)
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      console.log('data is', data);
      setExtractedText(data.text);
      Cookies.set('knowledgeBase', JSON.stringify(data.text));
    } catch (error) {
      console.error('Error extracting text:', error);
      setExtractedText('Error extracting text');
    }
  };


  return (
    <div className="my-4">
      <div className="file-upload-container">
        <input
          type="text"
          name=""
          placeholder="Enter Site URL"
          onChange={(e) => setSiteURL(e.target.value)}
          className="site-url-input"
        />
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={handleUpload} className="upload-btn">
          Upload & Extract Text
        </button>
      </div>
      {extractedText && (
        <div className="extracted-text-container">
          <h2 className="extracted-text-heading">Extracted Text:</h2>
          <pre className="extracted-text">{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
