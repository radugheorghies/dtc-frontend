const Input = ({
  errors,
  name,
  type,
  handleChange,
  handleBlur,
  values,
  disabled = false
}) => {
  return (
    <div>
      <input
        className="hadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
        name={name}
        type={type}
        disabled={disabled}
      />
      {errors[name] && (
        <div className="error text-red-600 m-b-20">{errors[name]}</div>
      )}
    </div>
  );
};

export default Input;
