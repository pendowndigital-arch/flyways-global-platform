import { Tag } from '../models/tag';
// import { ENDPOINTS } from '../config/api';

// Mock data — replace with real fetch when backend is ready:
// const res = await fetch(ENDPOINTS.tags);
// return res.json();
const MOCK_TAGS: Tag[] = [
  { id: '1',  name: 'Visa',          isRecommended: true  },
  { id: '2',  name: 'Regulation',    isRecommended: true  },
  { id: '3',  name: 'Scholarship',   isRecommended: true  },
  { id: '4',  name: 'Living',        isRecommended: true  },
  { id: '5',  name: 'Immigration',   isRecommended: false },
  { id: '6',  name: 'Student',       isRecommended: true  },
  { id: '7',  name: 'Housing',       isRecommended: false },
  { id: '8',  name: 'Academic',      isRecommended: false },
  { id: '9',  name: 'Financial Aid', isRecommended: true  },
  { id: '10', name: 'Application',   isRecommended: true  },
  { id: '11', name: 'International', isRecommended: false },
  { id: '12', name: 'Campus',        isRecommended: false },
];

export async function fetchTags(): Promise<Tag[]> {
  return Promise.resolve(MOCK_TAGS);
}
