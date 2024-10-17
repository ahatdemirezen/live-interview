import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePackageStore from '../../stores/PackagePageStore';
import { FaTrash, FaEdit } from 'react-icons/fa';

const PackageList = () => {
  const { packages, getPackages, deletePackage, loading, error } = usePackageStore();
  const navigate = useNavigate();

  useEffect(() => {
    getPackages();
  }, [getPackages]);

  const handleDelete = async (packageId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this package?');
    if (confirmDelete) {
      await deletePackage(packageId);
    }
  };

  const handleEdit = (packageId) => {
    navigate(`/create-package/${packageId}`);
  };

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div>Error loading packages: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        {/* Tablo başlıkları */}
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="font-semibold text-stone-500">
              <th className="w-4/12 py-2">Package Name</th>
              <th className="w-2/12 py-2">Question Count</th>
              <th className="w-2/12 py-2 text-center">Delete</th>
              <th className="w-2/12 py-2 text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id} className="bg-gray-50 hover:bg-teal-50">
                <td className="py-4 px-2">{pkg.title}</td>
                <td className="py-4 px-2">{pkg.questions.length}</td>
                <td className="py-4 px-2 text-center align-middle">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(pkg._id)}
                  >
                    <FaTrash className='text-rose-800'/>
                  </button>
                </td>
                <td className="py-4 px-2 text-center align-middle">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(pkg._id)}
                  >
                    <FaEdit className='text-rose-600' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageList;
