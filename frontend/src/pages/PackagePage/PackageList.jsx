import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePackageStore from '../../stores/PackagePageStore';
import { FaTrash, FaEdit } from 'react-icons/fa';

const PackageList = ({ packages }) => {
  const { getPackages, deletePackage, loading, error } = usePackageStore();
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
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="hidden md:table w-full text-left">
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
              <tr key={pkg._id} className="bg-white hover:bg-neutral-100">
                <td className="py-4 px-2">{pkg.title}</td>
                <td className="py-4 px-2">{pkg.questions.length}</td>
                <td className="py-4 px-2 text-center align-middle">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(pkg._id)}
                  >
                    <FaTrash className='text-[#ff2323] hover:text-[#cc0000]'/>
                  </button>
                </td>
                <td className="py-4 px-2 text-center align-middle">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(pkg._id)}
                  >
                    <FaEdit className='text-[#ff7f0a] hover:text-[#cc6600]' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white p-4 my-2 rounded-lg shadow-md">
              <h2 className="font-semibold text-lg">{pkg.title}</h2>
              <p className="text-gray-700">Questions: {pkg.questions.length}</p>
              <div className="flex justify-between mt-4">
                <button
                  className="text-red-600 hover:text-red-800 flex items-center"
                  onClick={() => handleDelete(pkg._id)}
                >
                  <FaTrash className='text-[#ff2323] hover:text-[#cc0000] mr-1'/>
                  Delete
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={() => handleEdit(pkg._id)}
                >
                  <FaEdit className='text-[#ff7f0a] hover:text-[#cc6600] mr-1' />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageList;
