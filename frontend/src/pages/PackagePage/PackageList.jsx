import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için kullanılıyor
import usePackageStore from '../../stores/PackagePageStore';
import { FaTrash, FaEdit } from 'react-icons/fa'; // FontAwesome'dan silme ve düzenleme ikonları


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
    <div className="bg-white p-6 rounded-lg shadow-md">
      
      {/* Tablo başlıkları */}
      <table className="table-auto w-full text-left">
  <thead>
    <tr className="font-semibold text-gray-700">
      <th className="w-4/12 py-2">Package Name</th>
      <th className="w-2/12 py-2">Question Count</th>
      <th className="w-2/12 py-2 text-center">Delete</th>
      <th className="w-2/12 py-2 text-center">Edit</th>
    </tr>
  </thead>
  <tbody>
    {packages.map((pkg) => (
      <tr key={pkg._id} className="bg-gray-50 hover:bg-gray-100">
        <td className="py-4 px-2">{pkg.title}</td>
        <td className="py-4 px-2">{pkg.questions.length}</td>
        <td className="py-4 px-2 text-center align-middle">
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(pkg._id)} // Silme butonu fonksiyonunu bağladık
          >
            <FaTrash /> {/* React Icons ile FontAwesome silme ikonu */}
          </button>
        </td>
        <td className="py-4 px-2 text-center align-middle">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(pkg._id)} // Düzenleme fonksiyonu bağlanıyor
          >
            <FaEdit /> {/* React Icons ile FontAwesome düzenleme ikonu */}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default PackageList;
