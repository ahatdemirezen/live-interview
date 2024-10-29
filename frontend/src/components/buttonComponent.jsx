import React from 'react';

const Button = ({
  label,
  onClick,
  type = 'button',
  icon = null, // icon varsayılan olarak null
  variant = '', // button tarzı: primary, secondary, vs.
  size = 'md', // button boyutu: sm, md, lg
  fullWidth = false, // butonun tam genişlik kaplaması
  rounded = false, // yuvarlatılmış köşe opsiyonu
  className = '', // eklenen ekstra className'ler
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
    primary: 'bg-[#47a7a2] text-white hover:bg-[#6fcfcb]',
    secondary: 'bg-[#6FCCB6] text-white hover:bg-amber-400 ml-4',
    outline: 'bg-[#5C7C98] text-white hover:bg-[#80ACD2]',
    special: 'bg-[#6F95B6] text-white'
  };
  
  // Köşe yapısı
  const roundedStyles = rounded ? 'rounded-full' : 'rounded-md';
  
  // Full width opsiyonu
  const fullWidthStyles = fullWidth ? 'w-full' : '';

  // İkon ile label arasında boşluk bırakma
  const iconSpacing = icon ? 'mr-2' : ''; // İkon varsa sağa boşluk ekliyoruz

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${roundedStyles} ${fullWidthStyles} ${className}`}
    >
      {icon && <span className={`text-lg ${iconSpacing}`}>{icon}</span>} {/* İkon */}
      {label}
    </button>
  );
};

export default Button;
