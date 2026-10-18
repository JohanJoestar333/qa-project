import React from 'react';
import { ProductColor } from '../types';
import { useRadioGroupKeys } from '../hooks/useRadioGroupKeys';

interface ColorSwatchesProps {
  colors: ProductColor[];
  selectedId: string;
  onSelect: (colorId: string) => void;
  testIdPrefix: string;
  size?: 'small' | 'large';
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  colors,
  selectedId,
  onSelect,
  testIdPrefix,
  size = 'small',
}) => {
  const dimensions = size === 'large' ? 'w-9 h-9' : 'w-6 h-6';
  const { groupRef, onKeyDown } = useRadioGroupKeys(
    colors.map((color) => color.id),
    selectedId,
    onSelect,
  );

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="Color"
      onKeyDown={onKeyDown}
      className="flex items-center gap-2"
    >
      {colors.map((color) => (
        <button
          key={color.id}
          type="button"
          role="radio"
          aria-checked={color.id === selectedId}
          tabIndex={color.id === selectedId ? 0 : -1}
          aria-label={color.name}
          title={color.name}
          onClick={() => onSelect(color.id)}
          data-testid={`${testIdPrefix}-${color.id}`}
          className={`swatch ${dimensions}`}
        >
          <span className="swatch-dot" style={{ backgroundColor: color.swatch }} />
        </button>
      ))}
    </div>
  );
};
