import type { Era } from '../../data/history';

type Props = {
  eras: Era[];
  selectedEraId: Era['id'];
  onSelect: (id: Era['id']) => void;
};

export function EraChipList({ eras, selectedEraId, onSelect }: Props) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-3" role="tablist" aria-label="Chọn giai đoạn lịch sử">
      {eras.map((era) => {
        const isActive = era.id === selectedEraId;
        return (
          <button
            key={era.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
              isActive
                ? 'border-brand-blue bg-brand-blue text-white'
                : 'border-brand-blue/40 bg-white text-brand-text hover:border-brand-blue hover:text-brand-blue'
            }`}
            onClick={() => onSelect(era.id)}
          >
            {era.name}
          </button>
        );
      })}
    </div>
  );
}

export default EraChipList;
