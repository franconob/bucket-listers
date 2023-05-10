import {useRef, useState} from 'react';
import Validator, {CardData, CardErrors} from './creditCard';

const useValidator = () => {
  const validator = useRef(new Validator()).current;
  const [errors, setErrors] = useState<CardErrors>();

  return {
    validate: (formData: CardData) => {
      setErrors(validator.validate(formData));
    },
    errors,
    isValid: validator.isValid,
  };
};

export {useValidator};
