// Lazy loader for medications data
let cnopsCacheData: any[] | null = null;
let cnssCacheData: any[] | null = null;

export async function loadMedications(insuranceType: 'cnops' | 'cnss' = 'cnops') {
  // Return cached data if available
  if (insuranceType === 'cnops' && cnopsCacheData) {
    return cnopsCacheData;
  }
  if (insuranceType === 'cnss' && cnssCacheData) {
    return cnssCacheData;
  }
  
  try {
    let module;
    if (insuranceType === 'cnss') {
      module = await import('./medications-cnss.json');
      cnssCacheData = module.default;
      return cnssCacheData;
    } else {
      module = await import('./medications-cnops.json');
      cnopsCacheData = module.default;
      return cnopsCacheData;
    }
  } catch (error) {
    console.error(`Failed to load ${insuranceType} medications:`, error);
    return [];
  }
}

export function searchMedications(query: string, insuranceType: 'cnops' | 'cnss' = 'cnops', limit: number = 50) {
  const cache = insuranceType === 'cnss' ? cnssCacheData : cnopsCacheData;
  
  if (!cache) {
    return [];
  }
  
  const searchTerm = query.toLowerCase();
  const results = cache.filter((med: any) =>
    med.name.toLowerCase().includes(searchTerm) ||
    med.dci?.toLowerCase().includes(searchTerm)
  );
  
  return results.slice(0, limit);
}
