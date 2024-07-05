import React, { useState, useEffect, useRef } from 'react';

export const CustomShapeDropdown = ({ options, value, onChange, shapePaths, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="Shape-container" ref={dropdownRef}>
        <label className="shape-label">{title}</label>
        <div
            className="shape-dropdown"
            onClick={() => setIsOpen(!isOpen)}
        >
            <ShapeOption shape={value} shapePaths={shapePaths} />
        </div>
        {isOpen && (
            <div className="dropdown-options">
            {options.map((shape) => (
                <div
                key={shape}
                className="dropdown-option"
                onClick={() => {
                    onChange(shape);
                    setIsOpen(false);
                }}
                >
                <ShapeOption shape={shape} shapePaths={shapePaths} />
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

const ShapeOption = ({ shape, shapePaths }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg
            width="20"
            height="20"
            viewBox="0 0 100 100"
            style={{ marginRight: '10px' }}
        >
            <path d={shapePaths[shape]} fill="#FFDD00" />
        </svg>
        {shape}
        </div>
    );
};