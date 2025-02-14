export const stripTrailingPathDelimiter = (str: string, pathDelimiter: string) => {
  if (str.substring(-1) === pathDelimiter) {
    return str.substring(0, str.length - 1);
  }
  return str;
};
