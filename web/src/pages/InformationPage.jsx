import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useInterviewStore from '../stores/InterviewFetchStore'; // Interview kontrol fonksiyonu
import useCandidateStore from '../stores/InformationFormStore'; // Zustand store dosyasını buraya import et
import dayjs from 'dayjs'; // Tarih kontrolü için
function PersonalInformationForm() {
  const { interviewId } = useParams(); // URL'den interviewId'yi alıyoruz
  const navigate = useNavigate(); // Yönlendirme yapmak için
  const { checkInterviewId, fetchExpireDate, interviewExists, expireDate, loading, error } = useInterviewStore(); // Interview ID kontrolü için zustand'dan fonksiyonları alıyoruz
  const { setCandidateForm, submitCandidateForm } = useCandidateStore(); // Zustand'daki fonksiyonları alıyoruz
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [accessError, setAccessError] = useState(false); // Erişim hatası için state
  useEffect(() => {
    // URL'den gelen interviewId'nin geçerli olup olmadığını kontrol ediyoruz
    checkInterviewId(interviewId);
    // Interview'a ait expireDate verisini de çekiyoruz
    fetchExpireDate(interviewId);
  }, [interviewId, checkInterviewId, fetchExpireDate]);
  useEffect(() => {
    // Eğer expireDate varsa ve şimdiki tarihten büyükse (geçmişse), erişim hatası set ediyoruz
    if (expireDate && dayjs(expireDate).isBefore(dayjs())) {
      setAccessError(true); // Tarih geçmişse, erişim hatası set ediliyor
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
    e.preventDefault(); // Sayfanın yeniden yüklenmesini önlüyoruz
    setCandidateForm(form); // Zustand state'ini form verileriyle güncelliyoruz
    
    try {
      const savedPersonalInfo = await submitCandidateForm(interviewId); // Formu gönderip, savedPersonalInfo'yu alıyoruz
      
      // Backend'den gelen `personalInfoId`'yi alıyoruz
      const { _id: formId } = savedPersonalInfo; // savedPersonalInfo nesnesinden id'yi çıkarıyoruz
      
      // Video sayfasına yönlendirme yapıyoruz (interviewId ve formId ile)
      navigate(`/interview/${interviewId}/${formId}`);
      
    } catch (error) {
      console.error("Form gönderim hatası:", error);
    }
  };
  
  
  if (loading) {
    return <p>Loading...</p>; // Yükleniyor ekranı
  }
  if (error) {
    return <p>Error: {error}</p>; // Hata varsa göster
  }
  if (interviewExists === false) {
    return <p>Interview not found! Please check the URL.</p>; // Interview ID bulunamazsa mesaj göster
  }
  // Eğer erişim hatası varsa, formu göstermeden sadece uyarı mesajı gösteriyoruz
  if (accessError) {
    return <p>Access denied: Interview link is expired.</p>;
  }
  return (
    <div style={{ width: '300px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ backgroundColor: '#ccc', padding: '10px', textAlign: 'center' }}>Personal Information Form</h2>
        <label>
          Name*:
          <input
            type="text"
            name="name"
            value={form.name} // input value state ile bağlanıyor
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
        <label>
          Surname*:
          <input
            type="text"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
        <label>
          Email*:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
        <label>
          Phone*:
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <input type="checkbox" name="kvkk" required style={{ marginRight: '10px' }} />
          <label>
            I have read and approved the <a href="#" style={{ textDecoration: 'underline' }}>KVKK text</a>.
          </label>
        </div>
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '15px' }}>
          Submit
        </button>
      </form>
    </div>
  );
}
export default PersonalInformationForm;