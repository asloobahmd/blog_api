export const isRegValid = ({ username, email, password }) => {
  if (!username || !email || !password) {
    return false;
  }
  return true;
};

export const isLoginValid = ({ username, email, password }) => {
  if (!username || !password) {
    return false;
  }
  return true;
};

export const postFieldsValidation = ({ title, desc, img, cat }) => {
  if (!title || !desc || !img || !cat) {
    return false;
  }
  return true;
};
