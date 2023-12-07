import { createRef, ChangeEvent } from 'react';

function AutoExpandingInput({ className, placeholder, inputValue, setInputValue }: { className: string, placeholder: string, inputValue: string, setInputValue: (value: string) => void }) {
    const inputRef = createRef<HTMLTextAreaElement>();

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setInputValue(value);

        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };

    return (
        <textarea
            className={className}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            maxLength={100}
            rows={1}
        />
    );
}

export default AutoExpandingInput;
