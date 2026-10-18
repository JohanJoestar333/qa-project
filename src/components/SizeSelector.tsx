import React from 'react';
import { ProductSize } from '../types';
import { useRadioGroupKeys } from '../hooks/useRadioGroupKeys';

interface SizeSelectorProps {
  sizes: ProductSize[];
  selectedId: string | null;
  onSelect: (sizeId: string) => void;
  hasError: boolean;
  testIdPrefix: string;
}

export const SizeSelector = React.forwardRef<HTMLDivElement, SizeSelectorProps>(
  ({ sizes, selectedId, onSelect, hasError, testIdPrefix }, forwardedRef) => {
    const { groupRef, onKeyDown } = useRadioGroupKeys(
      sizes.map((size) => size.id),
      selectedId,
      onSelect,
    );

    return (
      <div ref={forwardedRef}>
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label="Size"
          aria-invalid={hasError}
          onKeyDown={onKeyDown}
          className="grid grid-cols-3 gap-2"
        >
          {sizes.map((size, index) => {
            const isSelected = size.id === selectedId;
            // With nothing selected yet, the first size is the keyboard entry point
            const isTabStop = isSelected || (selectedId === null && index === 0);

            return (
              <button
                key={size.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isTabStop ? 0 : -1}
                onClick={() => onSelect(size.id)}
                data-testid={`${testIdPrefix}-${size.id}`}
                className={`size-option ${hasError ? 'size-option-error' : ''}`}
              >
                {size.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

SizeSelector.displayName = 'SizeSelector';
