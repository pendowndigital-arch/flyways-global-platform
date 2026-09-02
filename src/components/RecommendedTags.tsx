import { Tag } from '../models/tag';

interface RecommendedTagsProps {
  tags: Tag[];
  selectedTag: string;
  onTagSelect: (name: string) => void;
}

export function RecommendedTags({ tags, selectedTag, onTagSelect }: RecommendedTagsProps) {
  const recommended = tags.filter((t) => t.priority);

  if (recommended.length === 0) return null;

  const handleClick = (name: string) => {
    onTagSelect(selectedTag === name ? 'All' : name);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
        <h3 className="text-sm font-semibold text-gray-900">Recommended Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {recommended.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleClick(tag.name)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
              selectedTag === tag.name
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-300 ring-offset-1'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
