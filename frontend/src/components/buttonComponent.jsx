import React from 'react';
const Button = ({
  label,
  onClick,
  type = 'button',
  icon, // icon varsa
  variant = '', // button tarzı: primary, secondary, vs.
  size = 'md', // button boyutu: sm, md, lg
  fullWidth = false, // butonun tam genişlik kaplaması
  rounded = false, // yuvarlatılmış köşe opsiyonu
}) => {
  const baseStyles = 'flex items-center justify-center font-bold focus:outline-none transition duration-300';
  // Boyut stilleri
  const sizeStyles = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  // Renk ve stil varyantları
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-green-500 text-white hover:bg-green-600 ml-4',
    outline: 'border border-gray-500 text-gray-500 hover:bg-gray-100',
  };
  // Köşe yapısı
  const roundedStyles = rounded ? 'rounded-full' : 'rounded-md';
  // Full width opsiyonu
  const fullWidthStyles = fullWidth ? 'w-full' : '';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${roundedStyles} ${fullWidthStyles}`}
    >
      {icon && <span >{icon}</span>}
      {label}
    </button>
  );
};
export default Button;