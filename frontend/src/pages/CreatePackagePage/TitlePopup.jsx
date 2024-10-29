import React, { useState, useEffect } from "react";
import Modal from "../../components/modal";
import useCreatePackage from "../../stores/CreatePackagePageStore";  // Zustand store'u import ediyoruz
import TextInputComponent from "../../components/textInputComponent";
import Button from "../../components/buttonComponent";

const TitleModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');  // Package Title state'i

  const createPackage = useCreatePackage((state) => state.createPackage);  // Zustand'dan createPackage fonksiyonunu çekiyoruz
  const setPackageTitle = useCreatePackage((state) => state.setPackageTitle);  // Zustand'dan setPackageTitle fonksiyonu

  // Modal her açıldığında (isOpen true olduğunda) title state'ini sıfırla
  useEffect(() => {
    if (isOpen) {
      setTitle(''); // Modal açıldığında title input alanını temizle
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setPackageTitle(title);  // Zustand store'daki title state'ini güncelliyoruz

    // Paket oluşturma işlemini çağırıyoruz
    await createPackage();

    // Başarıyla kaydedildikten sonra modal'ı kapatıyoruz
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Package Title">
       
      {/* Package Title Girişi */}
      <div className="mb-4">
        <TextInputComponent onChange={(e) => setTitle(e.target.value)} value={title} textInputHeader='Package Title'/>
      </div>

      {/* Save Butonu */}
      <div className="flex justify-end">
       <Button onClick={handleSubmit} label='Save' variant="outline"/>
      </div>
    </Modal>
  );
};

export default TitleModal;
