import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfileSetup = () => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    location: '',
    remote: false,
    bio: '',
    experience: '',
    degree: '',
    major: '',
    university: '',
    preferred_titles: '',
  });

  const { location, remote, bio, experience, degree, major, university, preferred_titles } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const preferredTitlesArray = preferred_titles.split(',').map(title => title.trim());

    const profileData = {
      location,
      remote,
      bio,
      experience,
      degree,
      major,
      university,
      preferred_titles: preferredTitlesArray,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/profile/', profileData);
      console.log('Profile saved:', response.data);
      navigate('/upload')
      
      // Optionally, redirect to the next page for resume and skills
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Location:</label>
        <input type="text" name="location" value={location} onChange={onChange} />
      </div>
      <div>
        <label>Remote Allowed:</label>
        <input type="checkbox" name="remote" checked={remote} onChange={onChange} />
      </div>
      <div>
        <label>Bio:</label>
        <textarea name="bio" value={bio} onChange={onChange}></textarea>
      </div>
      <div>
        <label>Experience:</label>
        <textarea name="experience" value={experience} onChange={onChange}></textarea>
      </div>
      <div>
        <label>Degree:</label>
        <input type="text" name="degree" value={degree} onChange={onChange} />
      </div>
      <div>
        <label>Major:</label>
        <input type="text" name="major" value={major} onChange={onChange} />
      </div>
      <div>
        <label>University:</label>
        <input type="text" name="university" value={university} onChange={onChange} />
      </div>
      <div>
        <label>Preferred Job Titles (comma separated):</label>
        <input type="text" name="preferred_titles" value={preferred_titles} onChange={onChange} />
      </div>
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default UserProfileSetup;
