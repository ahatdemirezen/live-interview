const DateInputComponent = ({value, dateInputHeader, onChange }) => (
    <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-medium">{dateInputHeader}</label>
        <input
        type="date"
        value={value}
        onChange={onChange}
        className="border p-2 w-full rounded-md"
        />
    </div>
);
export default DateInputComponent;