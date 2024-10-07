import React from 'react';
import PackageItem from './PackageItem';
import usePackageStore from '../../stores/PackagePageStore';

const PackageList = () => {
  const { packages, removePackage } = usePackageStore();

  const handleDelete = (id) => {
    removePackage(id);
  };

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <PackageItem
          key={pkg.id}
          pkg={pkg}
          onDelete={() => handleDelete(pkg.id)}
          onEdit={() => console.log('Edit package', pkg.id)} 
        />
      ))}
    </div>
  );
};

export default PackageList;
