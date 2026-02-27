const MAX_LABEL_LENGTH = 200;

export const cleanedLabel = (value?: string | null): string | null => {
  if (!value) return null;
  const cleaned = value.replace(/\s+/g, ' ').replace(/\*/g, '').trim();
  if (!cleaned) return null;
  return cleaned.slice(0, MAX_LABEL_LENGTH);
};

export const isEligibleInput = (
  element: HTMLInputElement | HTMLTextAreaElement,
): boolean => {
  if (element instanceof HTMLInputElement) {
    const type = element.type.toLowerCase();
    if (['password', 'hidden', 'file', 'submit', 'button'].includes(type)) {
      return false;
    }
  }

  if (element.disabled || element.readOnly) return false;
  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none') return false;

  return true;
};

export const getLabelCandidates = (
  element: HTMLInputElement | HTMLTextAreaElement,
): string[] => {
  const candidates: string[] = [];

  if ('labels' in element && element.labels?.length) {
    for (const label of Array.from(element.labels)) {
      const cleaned = cleanedLabel(label.textContent);
      if (cleaned) candidates.push(cleaned);
    }
  }

  const closestLabel = element.closest('label');
  const closestLabelText = cleanedLabel(closestLabel?.textContent ?? null);
  if (closestLabelText) candidates.push(closestLabelText);

  const ariaLabel = cleanedLabel(element.getAttribute('aria-label'));
  if (ariaLabel) candidates.push(ariaLabel);

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const ids = ariaLabelledBy.split(/\s+/).filter(Boolean);
    for (const id of ids) {
      const labelled = document.getElementById(id);
      const labelledText = cleanedLabel(labelled?.textContent ?? null);
      if (labelledText) candidates.push(labelledText);
    }
  }

  const placeholder = cleanedLabel(element.getAttribute('placeholder'));
  if (placeholder) candidates.push(placeholder);

  const name = cleanedLabel(element.getAttribute('name'));
  if (name) candidates.push(name);

  return Array.from(new Set(candidates));
};

export const fillInput = (
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) => {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dataset.inputbuddyFilled = 'true';
};
