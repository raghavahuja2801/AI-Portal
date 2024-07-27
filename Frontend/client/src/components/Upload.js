import React, { useState } from 'react';
import axios from 'axios';

const UploadResume = () => {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://192.168.29.161:5000/api/profile/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="file" accept=".pdf,.docx" onChange={onFileChange} />
      <button type="submit">Upload Resume</button>
    </form>
  );
};

export default UploadResume;
