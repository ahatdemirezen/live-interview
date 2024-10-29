import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useInterviewStore from '../stores/InterviewFetchStore';
import useCandidateStore from '../stores/InformationFormStore';
import dayjs from 'dayjs';
import backgroundImage from '../assets/background.jpg'; // Arka plan resmi dosyasını içe aktardık

function PersonalInformationForm() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { checkInterviewId, fetchExpireDate, interviewExists, expireDate, loading, error } = useInterviewStore();
  const { setCandidateForm, submitCandidateForm } = useCandidateStore();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [accessError, setAccessError] = useState(false);

  useEffect(() => {
    checkInterviewId(interviewId);
    fetchExpireDate(interviewId);
  }, [interviewId, checkInterviewId, fetchExpireDate]);

  useEffect(() => {
    if (expireDate && dayjs(expireDate).isBefore(dayjs())) {
      setAccessError(true);
    }
  }, [expireDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCandidateForm(form);
    
    try {
      const savedPersonalInfo = await submitCandidateForm(interviewId);
      const { _id: formId } = savedPersonalInfo;
      navigate(`/interview/${interviewId}/${formId}`);
    } catch (error) {
      console.error("Form gönderim hatası:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (interviewExists === false) {
    return <p className="text-center text-red-500">Interview not found! Please check the URL.</p>;
  }

  if (accessError) {
    return <p className="text-center text-red-500">Access denied: Interview link is expired.</p>;
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
<div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
<h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Personal Information Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name*</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Surname*</label>
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone*</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-start">
            <input type="checkbox" name="kvkk" required className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label className="ml-2 block text-sm text-gray-700">
              I have read and approved the <a href="#" className="text-blue-600 hover:underline">KVKK text</a>.
            </label>
          </div>
          <button
  type="submit"
  className="w-full py-3 bg-[#224064] text-white font-semibold rounded-lg shadow-md hover:bg-[#0764BB] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
>
  Submit
</button>



        </form>
      </div>
    </div>
  );
}

export default PersonalInformationForm;
