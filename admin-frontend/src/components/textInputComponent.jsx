const TextInputComponent = ({ value, textInputHeader, onChange, className }) => {
  // Varsayılan className değeri
  const baseClassName = "border p-2 w-full rounded-md";

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2 font-medium">{textInputHeader}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={className || baseClassName}  // className sağlanmışsa onu kullan, aksi takdirde baseClassName'i kullan
      />
    </div>
  );
};

export default TextInputComponent;
