export function setTextContent(parents, selector, text) {
  if (!parents) return;
  const element = parents.querySelector(selector);
  if (!element) return;
  element.textContent = text;
  return element;
}

export function truncateText(text, MaxLength) {
  if (text.length < MaxLength) return text;

  return `${text.slice(0, MaxLength)}…`;
}
