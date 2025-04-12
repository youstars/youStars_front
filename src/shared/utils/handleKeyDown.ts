export const handleKeyDown =
  (
    nextFieldRef?: React.RefObject<HTMLInputElement>,
    isLast?: boolean
  ) =>
  (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isLast) {
        e.preventDefault();
        nextFieldRef?.current?.focus();
      }
    }
  };