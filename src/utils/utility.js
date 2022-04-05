const enums = require("../constants/enum");

const checkRole = (role) => Object.values(enums.UserRole).includes(role);

const checkGender = (gender) => Object.values(enums.Gender).includes(gender);

const lookup = (from, localField, foreignField, as) => {
  return {
    $lookup: {
      from,
      localField,
      foreignField,
      as,
    },
  };
};

const unwind = (path, preserveNullAndEmptyArrays = false) => {
  return {
    $unwind: {
      path,
      preserveNullAndEmptyArrays,
    },
  };
};

module.exports = {
  checkRole,
  checkGender,

  lookup,
  unwind,
};
