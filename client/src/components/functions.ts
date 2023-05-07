const protect_email = (user_email: string) => {
  let part1: string
  const splitted = user_email.split("@")
  part1 = splitted[0];
  const avg = part1.length / 2;
  part1 = part1.substring(0, (part1.length - avg));
  const part2 = splitted[1];
  return part1 + "...@" + part2;
};

export {
  protect_email
}