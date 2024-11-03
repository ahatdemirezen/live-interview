import React, { useEffect } from "react";
import useCreateInterviewStore from "../../stores/CreateInterviewPageStore";
import usePackageStore from "../../stores/PackagePageStore";
import Modal from "../../components/modal";
import TextInputComponent from "../../components/textInputComponent";
import DateInputComponent from "../../components/dateInputComponent";
import Button from "../../components/buttonComponent";
import dayjs from "dayjs"; // Tarih formatı için dayjs import ediliyor

const AddInterviewModal = ({ isOpen, onClose, onInterviewAdded, interviewData = null }) => {
  const {
    setInterviewTitle,
    setPackageId,
    setExpireDate,
    setCanSkip,
    setShowAtOnce,
    addInterview,
    currentInterview,
    updateInterview,
    setCurrentInterview,
    resetCurrentInterview, // Yeni fonksiyon ekliyoruz
  } = useCreateInterviewStore();

  const { packages, getPackages, loading } = usePackageStore();

  useEffect(() => {
    if (isOpen) {
      getPackages();
      if (interviewData) {
        
        // Eğer interviewData varsa, form alanlarını doldur
        setCurrentInterview({
          interviewTitle: interviewData.interviewTitle,
          expireDate: dayjs(interviewData.expireDate).format("YYYY-MM-DD"), // Tarihi formatlıyoruz
          packageId: interviewData.packageId.map(pkg => ({ _id: pkg._id, title: pkg.title })),
          canSkip: interviewData.canSkip,
          showAtOnce: interviewData.showAtOnce,
        });
      } else {
        // interviewData yoksa input alanlarını sıfırla
        resetCurrentInterview();
      }
    }
  }, [isOpen, getPackages, interviewData, setCurrentInterview, resetCurrentInterview]);

  const handlePackageSelect = (e) => {
    const selectedPackageId = e.target.value;
    const selectedPackage = packages.find(pkg => pkg._id === selectedPackageId);
    if (selectedPackage && !currentInterview.packageId.some(pkg => pkg._id === selectedPackageId)) {
      setPackageId([...currentInterview.packageId, { _id: selectedPackageId, title: selectedPackage.title }]);
    }
  };
  

 const removePackage = (pkgToRemoveId) => {
  setPackageId(currentInterview.packageId.filter(pkg => pkg._id !== pkgToRemoveId));
};


  const handleSaveInterview = async () => {
    if (interviewData) {
        // Eğer edit modundaysa güncelleme fonksiyonunu çağır
        await updateInterview(interviewData._id, currentInterview);
    } else {
        // Eğer yeni ekleme modundaysa add fonksiyonunu çağır
        await addInterview();
    }
    onClose(); // Modal'ı kapat
    onInterviewAdded(); // Sayfayı yenilemek yerine listeyi güncelle
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={interviewData ? "Edit Interview" : "Create Interview"}>
      <TextInputComponent
        value={currentInterview.interviewTitle}
        onChange={(e) => setInterviewTitle(e.target.value)}
        textInputHeader="Title"
      />

      <label className="block text-sm font-medium text-gray-700">Package</label>
      <select
        value=""
        onChange={handlePackageSelect}
        className="block w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>Select Package</option>
        {loading ? (
          <option value="">Loading...</option>
        ) : (
          packages
            .filter((pkg) => !currentInterview.packageId.some(selectedPkg => selectedPkg._id === pkg._id))
            .map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.title}
              </option>
            ))
        )}
      </select>

      <div className="mt-4">
        <h4 className="font-medium text-gray-700">Selected Packages:</h4>
        <div className="flex flex-wrap gap-2">
          {currentInterview.packageId && currentInterview.packageId.length > 0 ? (
            currentInterview.packageId.map((pkg, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
                <span>{pkg.title}</span>
                <button className="text-red-500" onClick={() => removePackage(pkg._id)}>✕</button>
              </div>
            ))
          ) : (
            <p>No packages selected</p>
          )}
        </div>
      </div>

      <DateInputComponent
        onChange={(e) => setExpireDate(e.target.value)}
        value={currentInterview.expireDate} // Formatlanmış tarih burada kullanılıyor
        dateInputHeader="Expire Date"
      />

      <div className="mt-4 flex space-x-4 items-center">
        <label className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Can Skip</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentInterview.canSkip}
              onChange={(e) => setCanSkip(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
          </label>
        </label>

        <label className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Show At Once</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentInterview.showAtOnce}
              onChange={(e) => setShowAtOnce(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
          </label>
        </label>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSaveInterview}
          size="md"
          variant="outline"
          rounded="rounded-md"
          label={interviewData ? "Save" : "Add"}
        />
      </div>
    </Modal>
  );
};

export default AddInterviewModal;
