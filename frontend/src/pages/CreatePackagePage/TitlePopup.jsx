import React, { useState } from "react";
import Modal from "../../components/modal";
import useCreatePackage from "../../stores/CreatePackagePageStore";  // Zustand store'u import ediyoruz

const TitleModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');  // Package Title state'i

  const createPackage = useCreatePackage((state) => state.createPackage);  // Zustand'dan createPackage fonksiyonunu çekiyoruz
  const setPackageTitle = useCreatePackage((state) => state.setPackageTitle);  // Zustand'dan setPackageTitle fonksiyonu

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
        <label className="block text-gray-700 mb-2">Package Title</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Package Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}  // State'e title'ı set et
        />
      </div>

      {/* Save Butonu */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default TitleModal;
