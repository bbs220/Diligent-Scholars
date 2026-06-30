export const capitalize = (str: string) => {
  const capitalizedString = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalizedString;
};
