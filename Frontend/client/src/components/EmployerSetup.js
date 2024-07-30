import React, { useState } from 'react';
import axios from 'axios';

const EmployerSetup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    website: '',
  });

  const { companyName, companyDescription, website } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("button clicked")

    try {
      const response = await axios.post('http://192.168.29.161:5000/api/employer/setup', formData);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="companyName"
        value={companyName}
        onChange={onChange}
        placeholder="Company Name"
        required
      />
      <textarea
        name="companyDescription"
        value={companyDescription}
        onChange={onChange}
        placeholder="Company Description"
      ></textarea>
      <input
        type="text"
        name="website"
        value={website}
        onChange={onChange}
        placeholder="Website"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default EmployerSetup;
