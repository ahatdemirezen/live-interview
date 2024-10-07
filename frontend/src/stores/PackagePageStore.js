import { create } from 'zustand';

const usePackageStore = create((set) => ({
  packages: [],  

  addPackage: (newPackage) => set((state) => ({
    packages: [...state.packages, newPackage]
  })),

  updatePackage: (id, updatedData) => set((state) => ({
    packages: state.packages.map(pkg => pkg.id === id ? { ...pkg, ...updatedData } : pkg)
  })),

  removePackage: (id) => set((state) => ({
    packages: state.packages.filter(pkg => pkg.id !== id)
  }))
}));

export default usePackageStore;
