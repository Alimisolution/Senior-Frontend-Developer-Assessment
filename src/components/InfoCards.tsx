import React from 'react';

interface InfoCardsProps {
  filteredData: any[];
  filterValues: any;
  cardBg: string;
  cardText: string;
  isMobile: boolean;
  onResetFilter: () => void;
}

const InfoCards: React.FC<InfoCardsProps> = ({ 
  filteredData, 
  filterValues, 
  cardBg, 
  cardText, 
  isMobile, 
  onResetFilter 
}) => {
  // Helper to format date for info card display
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  // Info card values from filtered data
  const paintValue = 'Sigma Coatings'; // Mock value
  const hullRoughness = filteredData.length > 0 ? (filteredData[filteredData.length - 1].shaftPower ?? 'N/A') : 'N/A';
  const logFactor = filteredData.length > 0 ? (filteredData[filteredData.length - 1].shaftSpeed ?? 'N/A') : 'N/A';
  const lastUnderwater = filteredData.length > 0 ? filteredData[filteredData.length - 1].timestamp : 'N/A';

  return (
    <div style={{ 
      flex: isMobile ? 'none' : 1, 
      height: isMobile ? '25%' : 'auto',
      minWidth: isMobile ? 0 : 320, 
      background: cardBg 
    }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: 16, overflowY: isMobile ? 'auto' : 'unset', maxHeight: isMobile ? '100%' : 'unset' }}>
        {/* Filter range and reset button */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#888', fontSize: 14 }}>
            {filterValues ? (
              <>
                <b>Filter:</b> {formatDate(filterValues.dateFrom)} to {formatDate(filterValues.dateTo)}
              </>
            ) : (
              <b>All Data</b>
            )}
          </span>
          <button
            style={{ marginLeft: 8, padding: '4px 10px', fontSize: 13, borderRadius: 4, border: '1px solid #bbb', background: '#f7f7f7', cursor: 'pointer' }}
            onClick={onResetFilter}
            disabled={!filterValues}
            aria-label="Reset filter"
          >
            Reset Filter
          </button>
        </div>
        <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
          <b>Paint</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : paintValue}
        </div>
        <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
          <b>Hull Roughness</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : hullRoughness}
        </div>
        <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
          <b>Log Factor</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : logFactor}
        </div>
        <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
          <b>Last Underwater</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : lastUnderwater}
        </div>
      </div>
    </div>
  );
};

export default InfoCards; 