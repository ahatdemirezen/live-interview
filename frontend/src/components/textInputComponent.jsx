const TextInputComponent = ({ value, textInputHeader, onChange, className = "" }) => {
    const baseClassName = "border p-2 w-full rounded-md";  // Varsayılan className
  
    return (
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{textInputHeader}</label>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={`${baseClassName} ${className}`}  // Varsayılan ve gelen className birleştiriliyor
        />
      </div>
    );
  };
  
  export default TextInputComponent;
  