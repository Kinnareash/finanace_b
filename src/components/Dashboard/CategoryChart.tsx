import React from 'react';

interface CategoryData {
  name: string;
  value: number;
  color: string;
  size: number;
}

const data: CategoryData[] = [
  { name: 'Dining', value: 5424, color: '#a3e635', size: 120 },
  { name: 'Travel', value: 3312, color: '#a3e635', size: 100 },
  { name: 'Groceries', value: 1200, color: '#a3e635', size: 80 },
  { name: 'Subscriptions', value: 650, color: '#1f2937', size: 70 },
  { name: 'Entertainment', value: 550, color: '#a3e635', size: 60 },
  { name: 'Bills', value: 250, color: '#e5e7eb', size: 50 },
  { name: 'Subscriptions', value: 150, color: '#a3e635', size: 40 },
];

const CategoryChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Spending in <span className="text-gray-500">March</span>
          </h3>
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold text-gray-900">$13,000.55</span>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              ↗ 12%
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative h-80 overflow-hidden">
        {/* Bubble Chart */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Large center bubble - Dining */}
          <div 
            className="absolute flex items-center justify-center rounded-full text-black font-bold"
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#a3e635',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-center">
              <div className="text-lg font-bold">$5,424</div>
              <div className="text-sm">Dining</div>
            </div>
          </div>

          {/* Travel bubble */}
          <div 
            className="absolute flex items-center justify-center rounded-full text-black font-bold"
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#a3e635',
              top: '65%',
              left: '25%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-center">
              <div className="text-base font-bold">$3,312</div>
              <div className="text-xs">Travel</div>
            </div>
          </div>

          {/* Groceries bubble */}
          <div 
            className="absolute flex items-center justify-center rounded-full text-black font-bold"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#a3e635',
              top: '20%',
              right: '20%',
              transform: 'translate(50%, -50%)'
            }}
          >
            <div className="text-center">
              <div className="text-sm font-bold">$1,200</div>
              <div className="text-xs">Groceries</div>
            </div>
          </div>

          {/* Subscriptions bubble (dark) */}
          <div 
            className="absolute flex items-center justify-center rounded-full text-white font-bold"
            style={{
              width: '70px',
              height: '70px',
              backgroundColor: '#1f2937',
              top: '70%',
              right: '25%',
              transform: 'translate(50%, -50%)'
            }}
          >
            <div className="text-center">
              <div className="text-sm font-bold">$650</div>
              <div className="text-xs">Subscriptions</div>
            </div>
          </div>

          {/* Entertainment bubble */}
          <div 
            className="absolute flex items-center justify-center rounded-full text-black font-bold"
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#a3e635',
              top: '45%',
              right: '10%',
              transform: 'translate(50%, -50%)'
            }}
          >
            <div className="text-center">
              <div className="text-xs font-bold">$550</div>
              <div className="text-xs">Entertainment</div>
            </div>
          </div>

          {/* Bills bubble */}
          <div 
            className="absolute flex items-center justify-center rounded-full text-gray-700 font-bold"
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#e5e7eb',
              top: '15%',
              left: '20%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-center">
              <div className="text-xs font-bold">$250</div>
              <div className="text-xs">Bills</div>
            </div>
          </div>

          {/* Small Subscriptions bubble */}
          <div 
            className="absolute flex items-center justify-center rounded-full text-black font-bold"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#a3e635',
              top: '50%',
              left: '15%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-center">
              <div className="text-xs font-bold">$150</div>
              <div className="text-xs">Subscriptions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">🚗</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Uber Transport</p>
                <p className="text-sm text-gray-500">24 Transactions</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">$400.00</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">💳</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Careem</p>
                <p className="text-sm text-gray-500">55 Transactions</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">$2,300.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;