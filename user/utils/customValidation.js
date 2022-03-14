/* eslint-disable no-else-return */
const isValidEmail = email => {
  const re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  return re.test(String(email).toLowerCase());
};

const isValidPassword = pwd => {
  const expression = /^(?=.*\d)(?=.*[!@#$%^&*;_~>])(?=.*[a-z])(?=.*[A-Z]).{8,25}$/;
  return expression.test(String(pwd));
};


const isInputEmpty = input => {
  if (input === undefined || input === null) {
    return 'Required Field';
  }
  if (input.trim() === '') {
    return 'Required Field';
  }
  return '';
};

const isInputPasswordValid = input => {
  if (input === undefined || input === null) {
    return 'Required Field';
  }
  input = input.toString().trim();
  if (input.trim() === '') {
    return 'Required Field';
  }
  if (isValidPassword(input) === false) {
    return 'Please enter a valid Password.';
  }
  return '';
};

const isInputEmailValid = input => {
  if (input === undefined || input === null) {
    return 'Required Field';
  }
  input = input.toString().trim();
  if (input.trim() === '') {
    return 'Required Field';
  }
  if (isValidEmail(input) === false) {
    return 'Please enter a valid Email.';
  }
  return '';
};






const customInputValidations = {
  isInputEmpty,
  isInputEmailValid,
  isInputPasswordValid,
};

module.exports = customInputValidations;
