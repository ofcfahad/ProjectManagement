const protect_email = (user_email: string) => {
  let part1: string
  const splitted = user_email.split("@")
  part1 = splitted[0];
  const avg = part1.length / 2;
  part1 = part1.substring(0, (part1.length - avg));
  const part2 = splitted[1];
  return part1 + "...@" + part2;
};

const convertHexToRGBA = (hexCode: string, alpha: number) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function themeColors(theme: string, ref: string) {
  if (theme === 'dark') {
    if (ref === 'background') {
      return 'bg-dark'
    }
    return 'white'
  }
  if (ref === 'background') {
    return 'bg-white'
  }
  return 'black'
}

export {
  protect_email,
  convertHexToRGBA,
  capitalize,
  themeColors
}