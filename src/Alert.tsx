// Create an alert that display any information or error messages to the user

type AlertProps = {
    message: string;
    type: 'info' | 'error' | 'success';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
    return (
        <>
        <div className={`alert alert-${type}`}>
            {message}
        </div>
        </>
    );
};

  
export default Alert;