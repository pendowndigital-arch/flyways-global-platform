import { useSearchParams } from 'react-router-dom';
import { Tag } from '../models/tag';

interface RecommendedTagsProps {
  tags: Tag[];
  onTagSelect: (name: string) => void;
}

export function RecommendedTags({ tags, onTagSelect }: RecommendedTagsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');
  const recommended = tags.filter((t) => t.isRecommended);

  if (recommended.length === 0) return null;

  const handleClick = (name: string) => {
    if (selectedTag === name) {
      setSearchParams({});
      onTagSelect('All');
    } else {
      setSearchParams({ tag: name });
      onTagSelect(name);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Recommended Tags</h3>
      <div className="flex flex-wrap gap-2">
        {recommended.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleClick(tag.name)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === tag.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
