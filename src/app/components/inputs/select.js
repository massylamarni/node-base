import React, { useState } from 'react';

export default function Select({ options, selected, setSelected }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="input-select">
      <div className="input-select-head" onClick={toggleDropdown}>
        <div className="input-select-name">{selected.name}</div>
        <div className="input-select-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="input-select-options">
          {options.map((option, index) => (
            <div key={index} onClick={() => handleSelect(option)} className={selected.name === option.name ? 'selected' : ''} >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
