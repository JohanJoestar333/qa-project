import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  testIdPrefix: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, defaultOpenId, testIdPrefix }) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    setOpenIds((current) => (current.includes(id) ? current.filter((openId) => openId !== id) : [...current, id]));
  };

  return (
    <div className="border-t border-line">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${testIdPrefix}-trigger-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`${testIdPrefix}-region-${item.id}`}
                onClick={() => toggle(item.id)}
                data-testid={`${testIdPrefix}-${item.id}`}
                className="w-full flex items-center justify-between gap-4 py-5 text-left text-[19px] text-ink"
              >
                {item.title}
                <Plus
                  className={`w-5 h-5 shrink-0 text-ink-2 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  strokeWidth={1.75}
                />
              </button>
            </h3>

            <div
              id={`${testIdPrefix}-region-${item.id}`}
              role="region"
              aria-labelledby={`${testIdPrefix}-trigger-${item.id}`}
              data-open={isOpen}
              data-testid={`${testIdPrefix}-panel-${item.id}`}
              className="accordion-panel"
            >
              <div className="accordion-inner">
                <div className="pb-6 text-[15px] text-ink-2 leading-relaxed">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
