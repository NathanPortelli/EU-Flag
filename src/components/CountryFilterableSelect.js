import React, { useState, useRef, useEffect } from 'react';

const CountryFilterableSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      setInputPlaceholder(options.find(option => option.value === value)?.label || placeholder);
    } else {
      setInputPlaceholder(placeholder);
    }
  }, [value, options, placeholder]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (value) {
          setInputPlaceholder(options.find(option => option.value === value)?.label || placeholder);
        } else {
          setInputPlaceholder(placeholder);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, value, options, placeholder]);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setFilter('');
    setInputPlaceholder(option.label);
    window.location.href = option.link; // Redirecting to the selected country's link
  };

  const handleInputFocus = () => {
    setInputPlaceholder('Select or type to filter...');
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    setFilter(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="filterable-select" ref={wrapperRef}>
      <input
        type="text"
        value={filter}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={() => {
          setTimeout(() => {
            if (!isOpen && value) {
              setInputPlaceholder(options.find(option => option.value === value)?.label || placeholder);
            }
          }, 100);
        }}
        placeholder={inputPlaceholder}
        className="filterable-select-input"
        ref={inputRef}
      />
      {isOpen && (
        <ul className="filterable-select-options">
          {filteredOptions.map(option => (
            <li 
              key={option.value} 
              onClick={() => handleSelect(option)}
              className={option.value === value ? 'selected' : ''}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryFilterableSelect;
