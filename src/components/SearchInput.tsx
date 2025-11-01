import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadMedications } from '@/data/medicationsLoader';

interface SearchResult {
  id: number;
  name: string;
  dci?: string;
  dosage?: string;
  ppv: number;
  base_remb: number;
  taux_remb: number;
  forme?: string;
  presentation?: string;
}

interface SearchInputProps {
  placeholder: string;
  onSelect: (result: SearchResult) => void;
  language: 'ar' | 'fr';
  insuranceType: 'cnops' | 'cnss';
}

// Separate caches for each insurance type
let cnopsCache: SearchResult[] | null = null;
let cnssCache: SearchResult[] | null = null;

export default function SearchInput({ placeholder, onSelect, language, insuranceType }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    // Search through database with async loading based on insurance type
    const searchTimer = setTimeout(async () => {
      try {
        // Get the appropriate cache for this insurance type
        const currentCache = insuranceType === 'cnss' ? cnssCache : cnopsCache;
        
        // Load medications if not cached
        if (!currentCache) {
          const data = await loadMedications(insuranceType);
          const mappedData = data.map((med: any) => ({
            id: med.id,
            name: med.name,
            dci: med.dci,
            dosage: med.dosage,
            ppv: med.ppv,
            base_remb: med.prix_br,
            taux_remb: med.taux_remb,
            forme: med.forme,
            presentation: med.presentation
          }));
          
          // Store in appropriate cache
          if (insuranceType === 'cnss') {
            cnssCache = mappedData;
          } else {
            cnopsCache = mappedData;
          }
        }
        
        // Get the updated cache reference
        const cache = insuranceType === 'cnss' ? cnssCache! : cnopsCache!;
        
        const searchTerm = query.toLowerCase();
        const filtered = cache.filter(med =>
          med.name.toLowerCase().includes(searchTerm) ||
          med.dci?.toLowerCase().includes(searchTerm)
        );
        
        // Limit results to top 50 for performance
        setResults(filtered.slice(0, 50));
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching medications:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query, insuranceType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.name);
    setIsOpen(false);
    onSelect(result);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          dir={dir}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            `w-full px-5 py-4 text-lg rounded-xl
            border-2 border-slate-300
            focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-200
            transition-all shadow-soft
            ${language === 'ar' ? 'font-arabic pr-14' : 'pl-14'}`,
            dir === 'rtl' && 'text-right'
          )}
        />

        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 text-slate-400",
          dir === 'rtl' ? 'right-4' : 'left-4'
        )}>
          <Search className="w-6 h-6" />
        </div>

        {isLoading && (
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2",
            dir === 'rtl' ? 'left-4' : 'right-4'
          )}>
            <Loader2 className="w-6 h-6 text-primary-700 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          dir={dir}
          className={cn(
            `absolute z-50 w-full mt-2
            bg-white rounded-xl shadow-strong border-2 border-slate-200
            max-h-96 overflow-y-auto`,
            dir === 'rtl' && 'text-right'
          )}
        >
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className={cn(
                `w-full px-5 py-4 text-left transition-colors
                hover:bg-primary-50 focus:bg-primary-50 focus:outline-none
                border-b border-slate-100 last:border-b-0`,
                selectedIndex === index && 'bg-primary-50',
                dir === 'rtl' && 'text-right'
              )}
            >
              <div className={`font-bold text-slate-900 mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {result.name}
              </div>
              {result.dci && (
                <div className="text-sm text-slate-500">
                  {result.dci} {result.dosage && `• ${result.dosage}`}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
        <div
          dir={dir}
          className={cn(
            "absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border-2 border-slate-200 p-5",
            dir === 'rtl' && 'text-right'
          )}
        >
          <p className={`text-slate-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'لم يتم العثور على نتائج' : 'Aucun résultat trouvé'}
          </p>
        </div>
      )}
    </div>
  );
}
