// verifies that an array of fields are not empty
function fieldsNotEmpty(...fields) {
  return fields.every(val => val);
}

// verifies that a password meets the sign-up criteria
// > 10 characters, contains a symbol, has a capital and lowercase letter
function validatePassword(password) {
  return password.length >= 10
    && /[!@#$%^&*()\-_=+{}[\]\\|;'",<.>/?`~]/.test(password)
    && /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(password);
}

export { fieldsNotEmpty, validatePassword };
