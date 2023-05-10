import {parse, isFuture, isValid, isThisMonth} from 'date-fns';

enum Issuer {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
  DISCOVER = 'DISCOVER',
}

enum Errors {
  CARD_NUMBER = 'Invalid card number',
  CVV = 'Invalid CVV',
  CARD_HOLDER_NAME = 'Invalid field',
  EXP_DATE = 'Invalid date',
}

type CardData = {
  cardNumber: string;
  expDate: string;
  cvv: string;
  firstName: string;
  lastName: string;
};

type CardErrors = Partial<CardData>;

function isVISACard(number: string) {
  return number[0] === '4' && [13, 16].includes(number.length);
}

function isMastercardCard(number: string) {
  return number[0] === '5' && number.length === 16;
}

function isAmericanExpressCard(number: string) {
  return (
    number[0] === '3' &&
    (number[1] === '4' || number[1] === '7') &&
    number.length === 15
  );
}

function isDiscoverCard(number: string) {
  return number[0] === '6' && number.length === 16;
}

function isValidCVV(issuer: Issuer, cvv: string) {
  return (
    (issuer === Issuer.AMERICAN_EXPRESS && cvv.length === 4) ||
    (issuer !== Issuer.AMERICAN_EXPRESS && cvv.length === 3)
  );
}

function isValidDate(date: string) {
  const parsedDate = parse(date, 'MM/yy', new Date());

  return (
    (isValid(parsedDate) && isThisMonth(parsedDate)) || isFuture(parsedDate)
  );
}

function isValidCardHolderName(name: string) {
  return /^[a-zA-z]+([\s][a-zA-Z]+)*$/.test(name) && name.length < 255;
}

function isLuhnValid(number: string) {
  let sum = 0;
  let isEven = false;
  for (let n = number.length - 1; n >= 0; n--) {
    const currentNumber = number.charAt(n);
    let nextNumber = parseInt(currentNumber, 10);

    if (isEven) {
      if ((nextNumber *= 2) > 9) {
        nextNumber -= 9;
      }
    }

    sum += nextNumber;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

function containsOnlyNumbers(creditCard: string) {
  return /^[0-9]+$/.test(creditCard);
}

function defaultValues(): CardData {
  return {
    cardNumber: '',
    cvv: '',
    expDate: '',
    firstName: '',
    lastName: '',
  };
}

class Validator {
  cardData: CardData = defaultValues();
  errors: CardErrors = {};
  issuer: Issuer | null = null;

  validate = (cardData: CardData) => {
    // clear errors
    this.errors = {};

    this.cardData = cardData;
    this.validateCardNumber();
    this.validateCVV();
    this.validateMonth();
    this.validateCardHolderName();

    return this.errors;
  };

  validateCardNumber = () => {
    const {cardNumber} = this.cardData;

    // Validate only numbers in card number
    if (!containsOnlyNumbers(cardNumber)) {
      this.errors.cardNumber = Errors.CARD_NUMBER;
      return;
    }

    // check if Luhn's algorithm is valid
    if (!isLuhnValid(cardNumber)) {
      this.errors.cardNumber = Errors.CARD_NUMBER;
      return;
    }

    // Validate issuer
    if (isMastercardCard(cardNumber)) {
      this.issuer = Issuer.MASTERCARD;
    } else if (isVISACard(cardNumber)) {
      this.issuer = Issuer.VISA;
    } else if (isDiscoverCard(cardNumber)) {
      this.issuer = Issuer.DISCOVER;
    } else if (isAmericanExpressCard(cardNumber)) {
      this.issuer = Issuer.AMERICAN_EXPRESS;
    } else {
      this.errors.cardNumber = Errors.CARD_NUMBER;
    }
  };

  validateCVV = () => {
    const {cvv} = this.cardData;

    // First make sure we have a valid issuer to validate the CVV
    if (!this.issuer) {
      return;
    }

    if (!isValidCVV(this.issuer, cvv)) {
      this.errors.cvv = Errors.CVV;
    }
  };

  validateMonth = () => {
    const {expDate} = this.cardData;

    if (!isValidDate(expDate)) {
      this.errors.expDate = Errors.EXP_DATE;
    }
  };

  validateCardHolderName = () => {
    const {firstName, lastName} = this.cardData;
    if (!isValidCardHolderName(firstName)) {
      this.errors.firstName = Errors.CARD_HOLDER_NAME;
    }

    if (!isValidCardHolderName(lastName)) {
      this.errors.lastName = Errors.CARD_HOLDER_NAME;
    }
  };

  isValid = () => Object.keys(this.errors).length === 0;
}

export default Validator;
export {
  isMastercardCard,
  isVISACard,
  isAmericanExpressCard,
  isDiscoverCard,
  isValidCVV,
  isValidDate,
  isValidCardHolderName,
  containsOnlyNumbers,
  Issuer,
  Errors,
};

export type {CardErrors, CardData};
