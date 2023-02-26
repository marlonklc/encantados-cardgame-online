import './Button.css';

const Button = ({ text = 'clique...', disable = false, onClick = () => {}, customClass = '' }) => {
    return (
        <button 
            className={`button ${customClass}`} 
            disabled={disable}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;