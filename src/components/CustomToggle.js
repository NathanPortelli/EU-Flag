export const CustomToggle = ({ option1, option2, isActive, onChange }) => {
    return (
        <div className="custom-toggle" onClick={onChange}>
        <div className={`custom-toggle-option ${!isActive ? 'active' : ''}`}>
            {option1}
        </div>
        <div className={`custom-toggle-option ${isActive ? 'active' : ''}`}>
            {option2}
        </div>
        </div>
    );
};