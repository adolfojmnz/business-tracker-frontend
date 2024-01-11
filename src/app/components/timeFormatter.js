export const formatDateTime = (datetimeStr) => {
  return datetimeStr.replace("T", " ").slice(0, 19);
};

