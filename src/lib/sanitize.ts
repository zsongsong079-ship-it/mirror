const FORBIDDEN = [
  "will happen",
  "you will",
  "your fate",
  "destined",
  "prediction",
  "forecast",
  "you are going to",
  "in the future",
];

export function sanitizeAIOutput(text: string): string {
  let out = text;
  for (const phrase of FORBIDDEN) {
    const re = new RegExp(phrase, "gi");
    if (re.test(out)) {
      if (typeof console !== "undefined") {
        console.warn(`[mirror] sanitized forbidden phrase: "${phrase}"`);
      }
      out = out.replace(re, "might invite reflection");
    }
  }
  return out;
}