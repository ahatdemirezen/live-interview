import React, { useEffect } from "react";
import useCreateInterviewStore from "../../stores/CreateInterviewPageStore";
import usePackageStore from "../../stores/PackagePageStore";
import Modal from "../../components/modal";
import TextInputComponent from "../../components/textInputComponent";
import DateInputComponent from "../../components/dateInputComponent";
import Button from "../../components/buttonComponent";
import dayjs from "dayjs"; // Tarih formatı için dayjs import ediliyor
import DropDown from "../../components/dropDownComponent";
import { AiFillCloseCircle } from "react-icons/ai";
import ToggleSwitch from "../../components/toggleSwitchComponent";

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

    // Eğer paket mevcut değilse ekle
    if (selectedPackage && !currentInterview.packageId.some(pkg => pkg._id === selectedPackageId)) {
        setPackageId([...currentInterview.packageId, { _id: selectedPackageId, title: selectedPackage.title }]);
    }
};

const removePackage = (pkgToRemoveId) => {
    // Seçili paket listesinden çıkarma
    setPackageId(currentInterview.packageId.filter(pkg => pkg._id !== pkgToRemoveId));
};

const handleSaveInterview = async () => {
  const updatedInterviewData = {
      ...currentInterview,
      packageId: currentInterview.packageId.map(pkg => pkg._id), // Sadece package ID'leri gönderiyoruz
  };

  if (interviewData) {
      // Eğer edit modundaysa güncelleme fonksiyonunu çağır
      await updateInterview(interviewData._id, updatedInterviewData);
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

      <DropDown packages={packages} currentInterview={currentInterview} loading={loading} handlePackageSelect={handlePackageSelect}/>

      <div className="mt-4">
        <h4 className="text-sm text-gray-700">Selected Packages:</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {currentInterview.packageId && currentInterview.packageId.length > 0 ? (
            currentInterview.packageId.map((pkg, index) => (
              <div key={index} className="flex items-center space-x-2 bg-[#B3CCE5] px-3 py-1 rounded-xl text-inherit max-w-xs overflow-hidden">
                <span>{pkg.title}</span>
                <Button onClick={() => removePackage(pkg._id)} icon={<AiFillCloseCircle className="text-gray-500 ml-6"/>}  className="p-0 m-0 h-1 w-1"/>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-700">No packages selected</p>
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
          <ToggleSwitch checked={currentInterview.canSkip} onChange={(e) => setCanSkip(e.target.checked)} label="Can Skip"/>
        </label>

        <label className="flex items-center space-x-2">
          <ToggleSwitch checked={currentInterview.showAtOnce} onChange={(e) => setShowAtOnce(e.target.checked)} label="Show At Once"/>
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
