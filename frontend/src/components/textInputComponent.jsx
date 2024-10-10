const TextInputComponent = ({value, textInputHeader, onChange}) => (
    <div className="mb-4">
        <label className="block text-gray-700 mb-2">{textInputHeader}</label>
        <input
        type="text"
        value={value}
        onChange={onChange}
        className="border p-2 w-full rounded-md"
        />
    </div>
 );
 export default TextInputComponent;