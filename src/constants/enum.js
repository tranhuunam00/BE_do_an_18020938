const UserRole = {
  ADMIN: "ADMIN",
  SALLER: "SALLER",
  CUSTOMER_SERVICE: "CUSTOMER_SERVICE",
  CUSTOMER: "CUSTOMER",
};

const Rate = {
  ONE: "ONE",
  TWO: "TWO",
  THREE: "THREE",
  FOUR: "FOUR",
  FIVE: "FIVE",
};

const LessonType = {
  FIXED: "FIXED",
  FLEXIBLE: "FLEXIBLE",
};

const LanguageCode = {
  VIETNAMESE: 1,
  JAPANESE: 2,
  ENGLISH: 3,
};

const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};

const Nationality = {
  VN: "VN",
  JP: "JP",
};

const Language = {
  VI: "vi",
  JA: "ja",
};

const StatusFlexibleLesson = {
  OPEN: "OPEN",
  REGISTERED: "REGISTERED",
  INPROGRESS: "INPROGRESS",
  CANCEL: "CANCEL",
  MISS: "MISS",
  FINISH: "FINISH",
};

const FilterCourse = {
  UPCOMING: "upcoming",
  INPROGRESS: "inprogress",
  FINISHED: "finished",
};

const TypePayment = {
  MOMO: "MOMO",
};

const TypeProduct = {
  TREE_IN_DOOR: "TREE_IN_DOOR",
  TREE_OUT_DOOR: "TREE_OUT_DOOR",
  KITS: "KITS",
  FERTILIZER: "FERTILIZER",
  COURSE: "COURSE",
};
module.exports = {
  UserRole,
  Rate,
  LessonType,
  TypePayment,
  LanguageCode,
  Gender,
  Nationality,
  Language,
  StatusFlexibleLesson,
  FilterCourse,
  TypeProduct,
};
