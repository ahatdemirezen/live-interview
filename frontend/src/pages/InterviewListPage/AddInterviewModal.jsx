import React, { useEffect } from "react";
import useCreateInterviewStore from "../../stores/CreateInterviewPageStore";
import usePackageStore from "../../stores/PackagePageStore"; // Paket store'unu import ediyoruz
import Modal from "../../components/modal";
import TextInputComponent from "../../components/textInputComponent";
import DateInputComponent from "../../components/dateInputComponent";
import Button from "../../components/buttonComponent";

const AddInterviewModal = ({ isOpen, onClose, onInterviewAdded }) => {
  const {
    setInterviewTitle,
    setPackageId,
    setExpireDate,
    setCanSkip,
    setShowAtOnce,
    addInterview,
    currentInterview,
  } = useCreateInterviewStore();

  // Package store'u kullanarak paketleri çekiyoruz
  const { packages, getPackages, loading } = usePackageStore();

  // Paketleri modal açıldığında yüklüyoruz
  useEffect(() => {
    if (isOpen) {
      getPackages(); // Paketleri getir
    }
  }, [isOpen, getPackages]);

  // Paket seçimi yaparken hem id hem de title'ı ekleyeceğiz
  const handlePackageSelect = (e) => {
    const selectedPackageId = e.target.value;
    const selectedPackage = packages.find(pkg => pkg._id === selectedPackageId); // Seçilen paketi buluyoruz
    if (selectedPackage && !currentInterview.packageId.some(pkg => pkg._id === selectedPackageId)) {
      setPackageId([...currentInterview.packageId, { _id: selectedPackageId, title: selectedPackage.title }]); // Hem id'yi hem title'ı ekliyoruz
    }
  };

  // Seçili paketi kaldırma işlemi (id ile silme yapıyoruz)
  const removePackage = (pkgToRemoveId) => {
    setPackageId(currentInterview.packageId.filter(pkg => pkg._id !== pkgToRemoveId));
  };

  // Interview oluşturma işlemi butona tıklanınca tetiklenir
  const handleAddInterview = async () => {
    await addInterview(); // Zustand store'daki addInterview fonksiyonunu çağırıyoruz
    onClose(); // Modal'ı kapatıyoruz
    onInterviewAdded(); // Interview eklendikten sonra listeyi yenilemek için callback fonksiyonunu çağırıyoruz
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Interview">
      <TextInputComponent
        value={currentInterview.interviewTitle}
        onChange={(e) => setInterviewTitle(e.target.value)}
        textInputHeader="Title"
      />

      {/* Birden fazla paket seçimi yapılabilen dropdown */}
      <label className="block text-sm font-medium text-gray-700">Package</label>
      <select
        value="" // Her zaman boş tutuyoruz ki her seçimden sonra yeniden paket seçilebilsin
        onChange={handlePackageSelect}
        className="block w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>Select Package</option>
        {loading ? (
          <option value="">Loading...</option>
        ) : (
          packages
            .filter((pkg) => !currentInterview.packageId.some(selectedPkg => selectedPkg._id === pkg._id)) // Zaten seçili olan paketleri dropdown'dan çıkarıyoruz
            .map((pkg) => (
              <option key={pkg._id} value={pkg._id}> {/* package title yerine id'yi gönderiyoruz */}
                {pkg.title}
              </option>
            ))
        )}
      </select>

      {/* Seçilen paketlerin altında etiket şeklinde gösterilmesi */}
      <div className="mt-4">
        <h4 className="font-medium text-gray-700">Selected Packages:</h4>
        <div className="flex flex-wrap gap-2">
          {currentInterview.packageId && currentInterview.packageId.length > 0 ? (
            currentInterview.packageId.map((pkg, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
                <span>{pkg.title}</span> {/* Artık title gösteriliyor */}
                <button
                  className="text-red-500"
                  onClick={() => removePackage(pkg._id)} // id ile kaldırma işlemi
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p>No packages selected</p>
          )}
        </div>
      </div>

      <DateInputComponent
        onChange={(e) => setExpireDate(e.target.value)}
        value={currentInterview.expireDate}
        dateInputHeader="Expire Date"
      />

      {/* Can Skip ve Show At Once switchleri */}
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
          onClick={handleAddInterview} // Butona tıklandığında veriler gönderilir
          size="md"
          variant="outline"
          rounded="rounded-md"
          label="Add"
        />
      </div>
    </Modal>
  );
};

export default AddInterviewModal;
