import React from 'react';

const Select = ({
  multiple,
  children,
  className,
  errors,
  name,
  type,
  handleChange,
  handleBlur,
  values
}) => {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      <select
        multiple={multiple}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
        onChange={handleChange}
        onBlur={handleBlur}
        defaultValue={values[name]}
        name={name}
        type={type}
      >
        {children}
      </select>
      {errors[name] && (
        <div className="error text-red-1 m-b-20">{errors[name]}</div>
      )}
    </div>
  );
};

export default Select;