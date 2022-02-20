const UserRole = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  TUTOR: 'TUTOR',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE',
};

const Rate = {
  ONE: 'ONE',
  TWO: 'TWO',
  THREE: 'THREE',
  FOUR: 'FOUR',
  FIVE: 'FIVE',
};

const LessonType = {
  FIXED: 'FIXED',
  FLEXIBLE: 'FLEXIBLE',
};

const LanguageCode = {
  VIETNAMESE: 1,
  JAPANESE: 2,
  ENGLISH: 3,
};

const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

const Nationality = {
  VN: 'VN',
  JP: 'JP',
};

const Language = {
  VI: 'vi',
  JA: 'ja',
};

const StatusFlexibleLesson = {
  OPEN: 'OPEN',
  REGISTERED: 'REGISTERED',
  INPROGRESS: 'INPROGRESS',
  CANCEL: 'CANCEL',
  MISS: 'MISS',
  FINISH: 'FINISH',
};

const FilterCourse = {
  UPCOMING: 'upcoming',
  INPROGRESS: 'inprogress',
  FINISHED: 'finished',
};

const Filter = {
  NAME: 'NAME',
  CREATED_AT: 'CREATED_AT',
};

const FilterPrice = {
  LT10: 'lt10',
  GTE10_LTE25: 'gte10-lte25',
  GT25: 'gt25',
  LT100: 'lt100',
  GTE100_LTE400: 'gte100-lte400',
  GT400: 'gt400'
};

const FilterTime = {
  GTE6_LTE9: 0,
  GTE9_LTE12: 1,
  GTE12_LTE15: 2,
  GTE15_LTE18: 3,
  GTE18_LTE22: 4,
};

const MethodPayment = {
  PAYPAL: 'PAYPAL'
}

const Currency = {
  USD: 'USD'
}

module.exports = {
  UserRole,
  Rate,
  LessonType,
  LanguageCode,
  Gender,
  Nationality,
  Language,
  StatusFlexibleLesson,
  FilterCourse,
  Filter,
  FilterPrice,
  FilterTime,
  MethodPayment,
  Currency,
};
