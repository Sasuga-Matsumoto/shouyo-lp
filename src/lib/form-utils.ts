export function scrollToFirstError(
  form: HTMLFormElement | null,
  errors: Record<string, string | undefined>
): void {
  if (!form) return;

  const firstErrorKey = Object.keys(errors).find((key) => errors[key]);
  if (!firstErrorKey) return;

  const element = form.elements.namedItem(firstErrorKey) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;
  if (!element) return;

  const inputGroup = element.closest('.input-group');
  const scrollTarget = inputGroup || element;

  setTimeout(() => {
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus({ preventScroll: true });

    element.classList.add('shake');
    element.addEventListener(
      'animationend',
      () => element.classList.remove('shake'),
      { once: true }
    );
  }, 50);
}
