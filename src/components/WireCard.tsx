import React, { useState } from 'react';
import { Wire, BuyWire, RentWire, ShortLetWire, JointVentureWire } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { numberCommas } from '@/utils/numberCommas';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth(); // Get current authenticated user
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Helper function to get header color based on request type
  const getHeaderColor = (requestType: string) => {
    switch (requestType) {
      case 'Buy':
        return 'bg-rose-50 border-l-4 border-rose-400';
      case 'Rent':
        return 'bg-green-50 border-l-4 border-green-400';
      case 'Short Let':
        return 'bg-orange-50 border-l-4 border-orange-400';
      case 'Joint Venture':
        return 'bg-purple-50 border-l-4 border-purple-400';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400';
    }
  };

  // Helper function to get the description text
  const getDescriptionText = () => {
    const buyWire = wire as BuyWire;
    const rentWire = wire as RentWire;
    const shortLetWire = wire as ShortLetWire;
    const jvWire = wire as JointVentureWire;

    switch (wire.requestType) {
      case 'Buy':
        if (buyWire.propertyType === 'Bare Land') {
          return `${buyWire.propertyType} for ${buyWire.useCase} use`;
        } else if (buyWire.useCase === 'Commercial') {
          return `${buyWire.commercialUseCase} in ${buyWire.commercialPropertyType}`;
        } else {
          return `${buyWire.buildingType} for ${buyWire.useCase} use`;
        }
      case 'Rent':
        if (rentWire.propertyType === 'Bare Land') {
          return `${rentWire.propertyType} for ${rentWire.useCase} use`;
        } else if (rentWire.useCase === 'Commercial') {
          return `${rentWire.commercialUseCase} in ${rentWire.commercialPropertyType}`;
        } else {
          return `${rentWire.buildingType === 'Any of the above' ? 'Property' : rentWire.buildingType} for ${rentWire.useCase} use`;
        }
      case 'Short Let':
        return `${shortLetWire.buildingType} for ${shortLetWire.useCase} use`;
      case 'Joint Venture':
        return `${jvWire.jvDevelopmentType} Joint Venture`;
      default:
        return '';
    }
  };

  // Helper function to handle share action
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/wire/${wire.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for browsers that don't support clipboard API
      alert('Link copied to clipboard!');
    }
  };

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
            <div className="flex h-full pt-4 space-x-2 items-center">
              <span className="text-xl">{Icons.mapPin2}</span>
              <p>{buyWire.units} {buyWire.landSize ? pluralizeLandSize(buyWire.landSize, buyWire.units || 1) : ''}</p>
            </div>
          </div>
        )}

        {/* Not Bare Land and Residential Request */}
        {buyWire.propertyType !== 'Bare Land' && buyWire.useCase === 'Residential' && (
          <div className="flex grow flex-col px-8">
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
            <div className="flex space-x-2 pt-4 items-center">
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
              
              {/* Budget feedback section - Always visible, trigger modal for unauthenticated users */}
              <div className="ml-7 flex items-center gap-4">
                <span className="text-xs text-gray-500">Budget feedback:</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => !user && setShowRegisterModal(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-green-200 hover:bg-green-50 transition-colors"
                    title="Mark as good budget"
                  >
                    <span className="text-green-600">{Icons.thumbsUp}</span>
                    <span className="text-green-700">Good</span>
                  </button>
                  <button 
                    onClick={() => !user && setShowRegisterModal(true)}
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
            {/* Responses count and profile badge */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>{wire.responses?.length || 0} Response{(wire.responses?.length || 0) !== 1 ? 's' : ''}</span>
              </div>
              
              {/* Profile completion badge */}
              {wire.customerProfileCompleted && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Profile Complete
                </span>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              {/* Share button - Always visible */}
              <button 
                onClick={handleShare}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Share
              </button>
              
              {/* Respond button - Show modal for unauthenticated users */}
              {user ? (
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                  Respond
                </button>
              ) : (
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Respond
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Register Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Register to Respond</h3>
              <p className="text-gray-600 mb-6">
                You need to register as an agent or landlord to respond to property requests.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    // Navigate to registration page
                    window.location.href = '/auth/signup';
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <span className="text-lg">✅</span>
              <span className="font-medium">Link Copied!</span>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden w-full md:max-w-2xl lg:max-w-3xl">
      {/* Header with Request ID, Type, Description and Call-to-Action */}
      <a 
        href={`/wire/${wire.id}`}
        className="block cursor-pointer"
        title="Click to view full details"
      >
        <div className={`p-4 ${getHeaderColor(wire.requestType)} hover:opacity-80 transition-opacity`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">ID: {wire.requestID}</p>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{wire.requestType}</h2>
              <p className="text-sm text-gray-700">{getDescriptionText()}</p>
            </div>
            <div className="flex flex-col items-center text-gray-600 ml-4">
              <span className="text-xs text-gray-500 mb-1">See more details</span>
              <span className="text-lg">→</span>
            </div>
          </div>
        </div>
      </a>

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
