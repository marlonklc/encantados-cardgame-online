import './Button.css';

const Button = ({ text = 'clique...', disable = false, onClick = () => { } }) => {
    return (
        <button 
            class="button" 
            disabled={disable}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;