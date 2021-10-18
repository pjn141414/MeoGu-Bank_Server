export default (): string => {
  const uuid = '719xxxxxxxxx'.replace(/[x]/g, (c) => {
    let r = (Math.random() * 10) | 0;
    let v = c === 'x' ? r : (r & 3 | 8);
    return v.toString();
  });

  return uuid;
};