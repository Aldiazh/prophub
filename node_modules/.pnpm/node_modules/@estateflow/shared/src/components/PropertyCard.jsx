import React from 'react';
import { Link } from 'react-router-dom';
import { MaterialIcon } from './MaterialIcon';
import { useSavedProperties } from '../hooks/useSavedProperties';

export function PropertyCard({ property }) {
  const { isSaved, toggleSaved } = useSavedProperties();
  const isFavorited = isSaved(property.id);

  const statusColors = {
    Available: 'bg-secondary text-on-secondary',
    'New Listing': 'bg-secondary text-on-secondary',
    'Under Contract': 'bg-outline text-surface',
    Occupied: 'bg-outline text-surface',
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const displayPrice = property.price || `${formatRupiah(property.price_per_month)}/bln`;
  const displayImage = property.image || (property.property_images && property.property_images.length > 0 ? property.property_images[0].image_url : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800');

  return (
    <Link
      to={`/property/${property.id}`}
      className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant hover:shadow-md transition-shadow duration-300 block"
    >
      {/* Image */}
      <div className="h-64 relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={displayImage}
          alt={property.title}
        />
        {property.status && (
          <div className={`absolute top-4 left-4 font-label-sm text-label-sm px-3 py-1 rounded-full ${statusColors[property.status] || 'bg-secondary text-on-secondary'}`}>
            {property.status}
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaved(property.id);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface hover:text-error transition-colors"
        >
          <MaterialIcon
            icon="favorite"
            style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : {}}
            className={isFavorited ? 'text-error' : ''}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-secondary font-headline-lg text-headline-lg mb-1">{displayPrice}</div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{property.title}</h3>
        <div className="flex items-center text-on-surface-variant mb-4 font-body-sm text-body-sm">
          <MaterialIcon icon="location_on" className="text-sm mr-1" />
          {property.location}
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-outline-variant text-on-surface-variant flex-wrap">
          {property.amenities?.map((amenity, index) => (
            <div key={index} className="flex items-center gap-1">
              <MaterialIcon icon={amenity.icon} className="text-lg" />
              <span className="text-label-sm">{amenity.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
