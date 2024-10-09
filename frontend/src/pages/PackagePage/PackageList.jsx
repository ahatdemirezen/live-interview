import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için kullanılıyor
import usePackageStore from '../../stores/PackagePageStore';

const PackageList = () => {
  const { packages, getPackages, deletePackage, loading, error } = usePackageStore(); // deletePackage fonksiyonunu aldık
  const navigate = useNavigate(); // useNavigate ile sayfalar arası yönlendirme yapılacak

  // Bileşen yüklendiğinde paketleri almak için
  useEffect(() => {
    getPackages(); // Paketleri çekmek için API'ye istek atılır
  }, [getPackages]);

  // Silme işlemi için fonksiyon
  const handleDelete = async (packageId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this package?');
    if (confirmDelete) {
      await deletePackage(packageId); // Silme fonksiyonu çağrılır
    }
  };

  // Düzenleme için yönlendirme fonksiyonu
  const handleEdit = (packageId) => {
    navigate(`/create-package/${packageId}`); // Paket düzenleme sayfasına yönlendir
  };

  if (loading) return <div>Loading packages...</div>; // Yükleniyor durumu
  if (error) return <div>Error loading packages: {error}</div>; // Hata durumu

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <div
          key={pkg._id} // Veritabanından dönen _id kullanılıyor
          className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="text-lg">{pkg.title}</div> {/* Başlık gösterimi */}
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-lg">{pkg.questions.length}</div> {/* Soru sayısı */}
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => handleEdit(pkg._id)} // Düzenleme fonksiyonu bağlanıyor
            >
              ✏️
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => handleDelete(pkg._id)} // Silme butonu fonksiyonunu bağladık
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageList;
