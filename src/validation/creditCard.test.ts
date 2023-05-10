import Validator, {
  CardData,
  containsOnlyNumbers,
  Errors,
  isAmericanExpressCard,
  isDiscoverCard,
  isMastercardCard,
  Issuer,
  isValidCardHolderName,
  isValidCVV,
  isValidDate,
  isVISACard,
} from './creditCard';
import {format} from 'date-fns';

// VISA cards
const visaCard13Valid = '4555678123009'; // starts with 4, length 13
const visaCard16Valid = '4555678123231443'; // starts with 4, length 16
const visaCardInvalid1 = '323123123123'; // starts with 3
const visaCardInvalid2 = '41236754321345'; // starts with 4, length 14

// Mastercard cards
const masterCard16Valid = '5555678123231443'; // starts with 5, length 16
const masterCardInvalid1 = '3231231231233219'; // starts with 3, length 16
const masterCardInvalid2 = '512367543213453'; // length 15, starts with 5

// American Express cards
const amExCardValid = '345764900743662'; // starts with 3, followed by 4, length 15
const amExCardValid1 = '373755498014682'; // starts with 3, followed by 7, length 15
const amExCardInvalid = '356547890332465'; // starts with 3, followed by 5, length 15;
const amExCardInvalid1 = '34754688993567'; // starts with 3, followed by 4, length 14;

// Discover cards
const discCardValid = '6466775477901564'; // starts with 6, length 16
const discCardInvalid = '66744589022352'; // starts with 6, length 14

describe('should validate card numbers', () => {
  it('should contain a valid number', () => {
    const cn = '1234567891234567';

    expect(containsOnlyNumbers(cn)).toBeTruthy();
  });

  it('should contain an invalid number', () => {
    const cn = '123212AXXXA @';
    expect(containsOnlyNumbers(cn)).toBeFalsy();
  });
});

describe('test correct issuer', () => {
  describe('test VISA cards', () => {
    it('should mark VISA card as valid', () => {
      expect(isVISACard(visaCard13Valid)).toBeTruthy();
      expect(isVISACard(visaCard16Valid)).toBeTruthy();
    });

    it('should mark VISA card as invalid', () => {
      expect(isVISACard(visaCardInvalid1)).toBeFalsy();
      expect(isVISACard(visaCardInvalid2)).toBeFalsy();

      // test other cards
      expect(isVISACard(masterCard16Valid)).toBeFalsy();
      expect(isVISACard(amExCardValid)).toBeFalsy();
      expect(isVISACard(amExCardValid1)).toBeFalsy();
      expect(isVISACard(discCardValid)).toBeFalsy();
    });
  });

  describe('test MASTERCARD cards', () => {
    it('should mark MASTERCARD card as valid', () => {
      expect(isMastercardCard(masterCard16Valid)).toBeTruthy();
    });

    it('should mark MASTERCARD card as invalid', () => {
      expect(isMastercardCard(masterCardInvalid1)).toBeFalsy();
      expect(isMastercardCard(masterCardInvalid2)).toBeFalsy();

      // test other cards
      expect(isMastercardCard(visaCard13Valid)).toBeFalsy();
      expect(isMastercardCard(visaCard16Valid)).toBeFalsy();
      expect(isMastercardCard(amExCardValid)).toBeFalsy();
      expect(isMastercardCard(amExCardValid1)).toBeFalsy();
      expect(isMastercardCard(discCardValid)).toBeFalsy();
    });
  });

  describe('test American Express cards', () => {
    it('should mark card as valid', () => {
      expect(isAmericanExpressCard(amExCardValid)).toBeTruthy();
      expect(isAmericanExpressCard(amExCardValid1)).toBeTruthy();
    });

    it('should mark card as invalid', () => {
      expect(isAmericanExpressCard(amExCardInvalid)).toBeFalsy();
      expect(isAmericanExpressCard(amExCardInvalid1)).toBeFalsy();

      // test other cards
      expect(isAmericanExpressCard(visaCard16Valid)).toBeFalsy();
      expect(isAmericanExpressCard(visaCard13Valid)).toBeFalsy();
      expect(isAmericanExpressCard(masterCard16Valid)).toBeFalsy();
      expect(isAmericanExpressCard(discCardValid)).toBeFalsy();
    });
  });

  describe('test Discover cards', () => {
    it('should mark card as valid', () => {
      expect(isDiscoverCard(discCardValid)).toBeTruthy();
    });

    it('should mark card as invalid', () => {
      expect(isDiscoverCard(discCardInvalid)).toBeFalsy();

      // test other cards
      expect(isDiscoverCard(visaCard16Valid)).toBeFalsy();
      expect(isDiscoverCard(visaCard13Valid)).toBeFalsy();
      expect(isDiscoverCard(masterCard16Valid)).toBeFalsy();
      expect(isDiscoverCard(amExCardValid)).toBeFalsy();
      expect(isDiscoverCard(amExCardValid1)).toBeFalsy();
    });
  });
});

describe('test CVV', () => {
  const amexCVVValidator = (cvv: string) =>
    isValidCVV(Issuer.AMERICAN_EXPRESS, cvv);

  const otherIssuerCVVValidator = [
    (cvv: string) => isValidCVV(Issuer.VISA, cvv),
    (cvv: string) => isValidCVV(Issuer.MASTERCARD, cvv),
    (cvv: string) => isValidCVV(Issuer.DISCOVER, cvv),
  ];

  describe('test AMEX CVV', () => {
    it('should mark valid CVV for AMEX', () => {
      expect(amexCVVValidator('4443')).toBeTruthy();
    });

    it('should mark invalid CVV for AMEX', () => {
      expect(amexCVVValidator('321')).toBeFalsy();
    });
  });

  describe('test other CVV', () => {
    it('should mark CVV as valid', () => {
      expect(otherIssuerCVVValidator[0]('123')).toBeTruthy();
      expect(otherIssuerCVVValidator[1]('456')).toBeTruthy();
      expect(otherIssuerCVVValidator[2]('110')).toBeTruthy();
    });

    it('should mark CVV as invalid', () => {
      expect(otherIssuerCVVValidator[0]('1')).toBeFalsy();
      expect(otherIssuerCVVValidator[1]('4567')).toBeFalsy();
      expect(otherIssuerCVVValidator[2]('')).toBeFalsy();
    });
  });
});

describe('test expiration date', () => {
  it('should mark date as valid', () => {
    const expDate = '06/23';
    expect(isValidDate(expDate)).toBeTruthy();
  });

  it('should mark date as valid because is within the last month', () => {
    const expDate = format(new Date(), 'MM/yy');

    expect(isValidDate(expDate)).toBeTruthy();
  });

  it('should mark date as invalid because is a past date', () => {
    const expDate = '04/23';

    expect(isValidDate(expDate)).toBeFalsy();
  });

  it('should mark date as invalid because of entering an invalid format', () => {
    const expDate = '11/2023';

    expect(isValidDate(expDate)).toBeFalsy();
  });
});

describe('test card holder name', () => {
  it('should mark card holder name as valid', () => {
    const name = 'Franco';
    const composedName = 'Franco Jeronimo';

    expect(isValidCardHolderName(name)).toBeTruthy();
    expect(isValidCardHolderName(composedName)).toBeTruthy();
  });

  it('should mark card holder name as invalid', () => {
    const name = 'Franco12';
    const longName = 'a'.repeat(255);

    expect(isValidCardHolderName(name)).toBeFalsy();
    expect(isValidCardHolderName(longName)).toBeFalsy();
  });
});

describe('test Validator class', () => {
  const validator = new Validator();
  const validForm: CardData = {
    // default VISA valid card
    cardNumber: '4111111145551142',
    expDate: '08/25',
    cvv: '557',
    firstName: 'John',
    lastName: 'Doe',
  };

  it('should mark form as valid for VISA card', () => {
    validator.validate(validForm);

    expect(validator.isValid()).toBeTruthy();
  });

  it('should mark form as valid for MASTERCARD card', () => {
    const masterCardForm = {...validForm, cardNumber: '5555555555554444'};
    validator.validate(masterCardForm);

    expect(validator.isValid()).toBeTruthy();
  });

  it('should mark form as valid for AMEX card', () => {
    const amexCardForm = {
      ...validForm,
      cardNumber: '371449635398431',
      cvv: '1234',
    };
    validator.validate(amexCardForm);

    expect(validator.isValid()).toBeTruthy();
  });

  it('should mark form as valid for DISCOVER card', () => {
    const discoverCardForm = {...validForm, cardNumber: '6011111111111117'};
    validator.validate(discoverCardForm);

    expect(validator.isValid()).toBeTruthy();
  });

  it('should fail with invalid card number', () => {
    // valid visa number but doesn't pass Luhn's test
    const invalidForm = {...validForm, cardNumber: '4888556622578475'};
    const errors = validator.validate(invalidForm);

    expect(errors).toStrictEqual({
      cardNumber: Errors.CARD_NUMBER,
    });
  });

  it('should fail with invalid expiration date', () => {
    const invalidForm = {...validForm, expDate: '02/22'};
    const errors = validator.validate(invalidForm);

    expect(errors).toStrictEqual({
      expDate: Errors.EXP_DATE,
    });
  });

  it('should fail with correct card number but wrong cvv', () => {
    // cvv 4-digit number only for Amex, here using Visa card
    const invalidForm = {...validForm, cvv: '1234'};
    const errors = validator.validate(invalidForm);

    expect(errors).toStrictEqual({
      cvv: Errors.CVV,
    });
  });

  it('should fail with wrong card holder first name', () => {
    const invalidForm = {...validForm, firstName: 'Amy 22'};
    const errors = validator.validate(invalidForm);

    expect(errors).toStrictEqual({
      firstName: Errors.CARD_HOLDER_NAME,
    });
  });

  it('should fail with correct AMEX card but wrong CVV', () => {
    // correct AMEX number, invalid cvv format
    const invalidForm = {
      ...validForm,
      cardNumber: '370000000000002',
      cvv: '123',
    };
    const errors = validator.validate(invalidForm);

    expect(errors).toStrictEqual({
      cvv: Errors.CVV,
    });
  });

  it('should fail with incorrect card number, incorrect cvv, incorrect expiration date and last name', () => {
    const invalidForm = {
      ...validForm,
      cardNumber: visaCardInvalid1,
      expDate: '02/D2',
      lastName: '& Daniel',
    };
    const errors = validator.validate(invalidForm);

    expect(errors).toStrictEqual({
      cardNumber: Errors.CARD_NUMBER,
      expDate: Errors.EXP_DATE,
      lastName: Errors.CARD_HOLDER_NAME,
      cvv: Errors.CVV,
    });
  });
});
