/**
 * Returns a high-quality fallback image URL from Unsplash based on the pet type.
 * Supports both Indonesian and English pet type names, case-insensitive.
 * 
 * @param {string} type - The pet type (e.g., 'Kucing', 'Dog', 'Kelinci', etc.)
 * @returns {string} - Unsplash photo URL
 */
export const getPetFallbackImage = (type) => {
  const fallbacks = {
    'kucing': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
    'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
    'anjing': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop',
    'dog': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop',
    'burung': 'https://images.unsplash.com/photo-1522856339183-5a70f56a5996?w=600&h=600&fit=crop',
    'bird': 'https://images.unsplash.com/photo-1522856339183-5a70f56a5996?w=600&h=600&fit=crop',
    'kelinci': 'https://images.unsplash.com/photo-1585110396000-c9fd4e4e5030?w=600&h=600&fit=crop',
    'rabbit': 'https://images.unsplash.com/photo-1585110396000-c9fd4e4e5030?w=600&h=600&fit=crop',
    'hamster': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop',
    'lainnya': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=600&fit=crop',
    'other': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=600&fit=crop'
  };
  const normalizedType = type ? type.trim().toLowerCase() : 'lainnya';
  return fallbacks[normalizedType] || fallbacks['lainnya'];
};
