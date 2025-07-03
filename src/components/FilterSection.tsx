import { RequestType } from '@/types';
import { lagosLocations } from '@/data/locations';

interface FilterSectionProps {
  idSearch: string;
  setIdSearch: (value: string) => void;
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
  requestTypeQuery: 'All' | RequestType;
  setRequestTypeQuery: (type: 'All' | RequestType) => void;
  clearLocations: () => void;
}

export default function FilterSection({
  idSearch,
  setIdSearch,
  selectedLocations,
  setSelectedLocations,
  requestTypeQuery,
  setRequestTypeQuery,
  clearLocations,
}: FilterSectionProps) {
  const filterBadges: Array<{ label: 'All' | RequestType; icon: string }> = [
    { label: 'All', icon: '🏢' },
    { label: 'Rent', icon: '🏠' },
    { label: 'Buy', icon: '🏡' },
    { label: 'Short Let', icon: '🏖️' },
    { label: 'Joint Venture', icon: '🤝' },
  ];

  const handleLocationChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  return (
    <div className="bg-tertiary-light dark:bg-gray-700 rounded-xl p-6 space-y-4">
      {/* Filter Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔧</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter Requests
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Request Type Badges */}
        <div className="flex flex-wrap gap-2">
          {filterBadges.map((badge) => (
            <button
              key={badge.label}
              onClick={() => setRequestTypeQuery(badge.label)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                requestTypeQuery === badge.label
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-gray-500'
              }`}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </button>
          ))}
        </div>

        {/* Location Filter */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <select
              multiple
              value={selectedLocations}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedLocations(values);
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              size={1}
            >
              <option value="" disabled>Filter by Location</option>
              {lagosLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          {selectedLocations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedLocations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full"
                >
                  {location}
                  <button
                    onClick={() => handleLocationChange(location)}
                    className="ml-1 text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={clearLocations}
                className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-full hover:bg-red-200 dark:hover:bg-red-800"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ID Search */}
        <div className="min-w-0 lg:w-64">
          <input
            type="text"
            value={idSearch}
            onChange={(e) => setIdSearch(e.target.value)}
            placeholder="Search by Request ID"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
