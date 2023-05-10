# Payment card form with validation
## Render component
1. Clone repository
2. Install dependencies
   - iOS: Run `yarn install` and `npx pod-install`
   - Android: Run `yarn install`
3. Start metro `yarn start`
4. Run app in simulator (`yarn ios` or `yarn android`)

## How to run tests
1. Make sure you ran `yarn install` first.
2. Run `yarn test`

## Notes
The **CVV** security code will be validated once the card number becomes valid.

## Internals
There is a class called `Validator` which uses simple function validators inside the same module to verify the data. This validator
class can be used as standalone or together with the `useValidator` hook.
This hook is more convenient if you need to validate a React form. Just import the hook, use the `validate` function to trigger
validation and then use the `isValid` function as needed and the `errors` property to display errors on the screen.
