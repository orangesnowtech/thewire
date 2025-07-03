import React from 'react';
import { Wire, BuyWire, RentWire, ShortLetWire, JointVentureWire } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { numberCommas } from '@/utils/numberCommas';

// Icon components to replace UIcon
const Icons = {
  bed: '🛏️',
  toilet: '🚽',
  mapPin: '📍',
  mapPin2: '🗺️',
  ruler: '📏',
  building: '🏢',
  wallet: '💰',
  money: '💵',
  clock: '⏰',
  calendar: '📅',
  home: '🏠',
  thumbsUp: '👍',
  thumbsDown: '👎',
  share: '📤',
  respond: '�'
};

interface WireCardProps {
  wire: Wire;
}

export default function WireCard({ wire }: WireCardProps) {
  // Helper function to properly pluralize land size units
  const pluralizeLandSize = (landSize: string, units: number): string => {
    if (units <= 1) return landSize;
    
    switch (landSize) {
      case 'Plot':
        return 'Plots';
      case 'Acres':
        return 'Acres'; // Already plural
      case 'Hectares':
        return 'Hectares'; // Already plural
      default:
        return landSize + 's';
    }
  };

  const renderBuyWireContent = (buyWire: BuyWire) => {
    return (
      <div className="flex flex-col">
        {/* Buying a Bare Land */}
        {buyWire.propertyType === 'Bare Land' && (
          <div className="flex grow flex-col px-8">
            <p className="text-sm">{buyWire.propertyType} for {buyWire.useCase} use</p>
            <div className="flex h-full pt-4 space-x-2 items-center">
              <span className="text-xl">{Icons.mapPin2}</span>
              <p>{buyWire.units} {buyWire.landSize ? pluralizeLandSize(buyWire.landSize, buyWire.units || 1) : ''}</p>
            </div>
          </div>
        )}

        {/* Not Bare Land and Residential Request */}
        {buyWire.propertyType !== 'Bare Land' && buyWire.useCase === 'Residential' && (
          <div className="flex grow flex-col px-8">
            <p className="text-sm">{buyWire.buildingType} for {buyWire.useCase} use</p>
            
            <div className="flex space-x-2 pt-4 items-center">
              <span className="text-xl">{Icons.bed}</span>
              <p>{buyWire.roomsNo} Bedrooms</p>
            </div>

            <div className="flex space-x-2 items-center">
              <span className="text-xl">{Icons.toilet}</span>
              <p>{buyWire.toiletBaths} {buyWire.toiletBaths === '1' ? 'Toilet' : 'Toilets'}</p>
            </div>
          </div>
        )}

        {/* Not Bare Land and Commercial Request */}
        {buyWire.propertyType !== 'Bare Land' && buyWire.useCase === 'Commercial' && (
          <div className="px-8 grow">
            <p className="text-sm">{buyWire.useCase} property in {buyWire.commercialPropertyType}</p>

            <div className="flex space-x-2 pt-4 items-center">
              <span className="text-xl">{Icons.ruler}</span>
              <p>{numberCommas(buyWire.floorSpace ?? 0)}<span className="text-sm">sqm</span></p>
            </div>

            <div className="flex space-x-2 items-center">
              <span className="text-xl">{Icons.building}</span>
              <p>{buyWire.commercialUseCase}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRentWireContent = (rentWire: RentWire) => {
    return (
      <div className="flex flex-col">
        {/* Bare Land */}
        {rentWire.propertyType === 'Bare Land' && (
          <div className="px-8 grow">
            <div className="text-sm pb-4">
              <p>{rentWire.propertyType} for {rentWire.useCase} use</p>
            </div>

            <div className="flex space-x-2 items-center">
              <span className="text-xl">{Icons.mapPin2}</span>
              <p>{rentWire.units} {rentWire.landSize ? pluralizeLandSize(rentWire.landSize, rentWire.units || 1) : ''}</p>
            </div>

            <div className="flex space-x-2 items-center">
              <span className="text-xl">{Icons.clock}</span>
              <p>{rentWire.rentDuration}</p>
            </div>
          </div>
        )}

        {/* Development for Commercial Use */}
        {rentWire.propertyType !== 'Bare Land' && rentWire.useCase === 'Commercial' && (
          <div className="px-8">
            <p className="text-sm">{rentWire.commercialUseCase} in {rentWire.commercialPropertyType}</p>

            <div className="pt-4">
              <div className="flex space-x-2 items-center">
                <span className="text-xl">{Icons.ruler}</span>
                <p>{numberCommas(rentWire.floorSpace ? rentWire.floorSpace : 0)}<span className="text-sm">sqm</span></p>
              </div>

              <div className="flex space-x-2 items-center">
                <span className="text-xl">{Icons.clock}</span>
                <p>{rentWire.rentDuration}</p>
              </div>
            </div>
          </div>
        )}

        {/* Development for Residential Use */}
        {rentWire.propertyType !== 'Bare Land' && rentWire.useCase === 'Residential' && (
          <div className="px-8">
            <p className="text-sm">{rentWire.buildingType === 'Any of the above' ? 'Property' : rentWire.buildingType} for {rentWire.useCase} use</p>
            <div className="flex pt-4 space-x-2 items-center">
              <span className="text-xl">{Icons.bed}</span>
              <p>{rentWire.roomsNo} {rentWire.roomsNo === '1' ? 'room' : 'rooms'}</p>
            </div>

            <div className="flex space-x-2 items-center">
              <span className="text-xl">{Icons.toilet}</span>
              <p>{rentWire.toiletBaths} {rentWire.toiletBaths === '1' ? 'toilet' : 'toilets'}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderShortLetWireContent = (shortLetWire: ShortLetWire) => {
    return (
      <div className="px-8 pt-4">
        <div className="flex grow flex-col">
          <p className="text-sm">{shortLetWire.buildingType} for {shortLetWire.useCase} use</p>

          <div className="flex space-x-2 pt-4 items-center">
            <span className="text-xl">{Icons.home}</span>
            <p>{shortLetWire.shortLetUnits} Units</p>
          </div>
          
          <div className="flex space-x-2 items-center">
            <span className="text-xl">{Icons.bed}</span>
            <p>{shortLetWire.roomsNo} Bedrooms</p>
          </div>

          <div className="flex space-x-2 items-center">
            <span className="text-xl">{Icons.toilet}</span>
            <p>{shortLetWire.toiletBaths} {shortLetWire.toiletBaths === '1' ? 'Toilet' : 'Toilets'}</p>
          </div>

          <div className="py-4">
            <div className="flex space-x-2 items-center mb-1">
              <span className="text-xl">{Icons.calendar}</span>
              <p>
                {shortLetWire.checkInDate ? formatDate(shortLetWire.checkInDate) : 'TBD'} - {shortLetWire.checkOutDate ? formatDate(shortLetWire.checkOutDate) : 'TBD'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJointVentureWireContent = (jvWire: JointVentureWire) => {
    return (
      <div className="px-8">
        <p className="text-sm">{jvWire.jvDevelopmentType} Joint Venture</p>
        
        <div className="flex space-x-2 pt-4 items-center">
          <span className="text-xl">{Icons.ruler}</span>
          <p>{numberCommas(jvWire.jvLandSizeSqm)} sqm</p>
        </div>

        <div className="flex space-x-2 items-center">
          <span className="text-xl">{Icons.building}</span>
          <p>{jvWire.jvPartyType}</p>
        </div>
      </div>
    );
  };

  const renderCommonFooter = () => {
    return (
      <>
        {/* Common section for all wires */}
        <div className="px-8 py-4">

          <div className="flex space-x-2 items-center mb-1">
            <span className="text-xl">{Icons.mapPin}</span>
            <span>
              {wire.locations && wire.locations.length > 0 ? 
                wire.locations.join(', ') : 
                'Not specified'
              }
            </span>
          </div>

          

          {('minBudget' in wire || 'maxBudget' in wire) && (
            <div className="mb-1">
              <div className="flex space-x-2 items-center mb-2">
                <span className="text-xl">{Icons.money}</span>
                <p>
                  ₦{('minBudget' in wire && wire.minBudget !== undefined && typeof wire.minBudget === 'number') ? numberCommas(wire.minBudget) : 'N/A'} - 
                  ₦{('maxBudget' in wire && wire.maxBudget !== undefined && typeof wire.maxBudget === 'number') ? numberCommas(wire.maxBudget) : 'N/A'}
                  {wire.requestType === 'Short Let' && <span className="text-sm">/day</span>}
                </p>
              </div>
              
              {/* Budget feedback section */}
              <div className="ml-7 flex items-center gap-4">
                <span className="text-xs text-gray-500">Budget feedback:</span>
                <div className="flex space-x-2">
                  <button 
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-green-200 hover:bg-green-50 transition-colors"
                    title="Mark as good budget"
                  >
                    <span className="text-green-600">{Icons.thumbsUp}</span>
                    <span className="text-green-700">Good</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-red-200 hover:bg-red-50 transition-colors"
                    title="Mark as low budget"
                  >
                    <span className="text-red-600">{Icons.thumbsDown}</span>
                    <span className="text-red-700">Low</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          
        </div>

        {/* Action buttons */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 rounded-b-lg">
          <div className="flex items-center justify-between">
            {/* Responses count */}
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>{wire.responses?.length || 0} Response{(wire.responses?.length || 0) !== 1 ? 's' : ''}</span>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-3">
               <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                Share
              </button>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                Respond
              </button>
             
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Header with Type and ID */}
      <div id="heading" className="flex items-top pt-4 px-8">
        <div className="grow">
          <p className="text-lg font-bold">{wire.requestType}</p>
        </div>
        <p className="text-xs">ID: {wire.requestID}</p>
      </div>

      {/* Wire type specific content */}
      {wire.requestType === 'Buy' && renderBuyWireContent(wire as BuyWire)}
      {wire.requestType === 'Rent' && renderRentWireContent(wire as RentWire)}
      {wire.requestType === 'Short Let' && renderShortLetWireContent(wire as ShortLetWire)}
      {wire.requestType === 'Joint Venture' && renderJointVentureWireContent(wire as JointVentureWire)}

      {/* Common footer for all wire types */}
      {renderCommonFooter()}
    </div>
  );
}
