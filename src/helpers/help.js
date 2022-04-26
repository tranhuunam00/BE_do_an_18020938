function isVietnamesePhoneNumber(number) {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

const randomNumber = (max) => {
  return Math.floor(Math.random() * 10000);
};
module.exports = { isVietnamesePhoneNumber, randomNumber };
