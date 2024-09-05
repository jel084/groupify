import React from 'react';

const CustomInput = ({ icon, placeholder, value, onChange, name, type = "text" }) => {
  return (
    <div className="flex w-full my-3">
      <div className="flex items-center rounded-lg border-primary_color bg-[rgb(255,255,255)] w-full px-4 drop-shadow-md"> {/*input_container */}
        {icon && (
          <div className="text-[20px] text-primary_color pr-2"> {/*input_icon */}
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          className="border-none outline-none text-primary_color text-[16px] flex-grow bg-[rgb(255,255,255)] placeholder:font-light placeholder:text-primary_lite p-0 py-2"  //input input
        />
      </div>
    </div>
  );
};

export default CustomInput;
