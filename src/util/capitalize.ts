export default function capitalize(str: string, allFirstLetters = false) {
  if (!allFirstLetters) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
