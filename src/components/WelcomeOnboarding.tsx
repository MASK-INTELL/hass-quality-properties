'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Key, Map, Building2, Car, Bike, X } from 'lucide-react';

const goalToCategory: Record<string, string> = {
  buy_home: 'Homes',
  rent: 'Rentals',
  land: 'Lands',
  commercial: 'Homes',
  cars: 'Cars',
  motorcycles: 'Motorcycles',
};

export default function WelcomeOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasSeen = localStorage.getItem('hass_onboarding_complete');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hass_onboarding_complete', 'true');
  };

  const handleGoalSelect = (selectedGoal: string) => {
    handleClose();
    const category = goalToCategory[selectedGoal] || '';
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : '/properties');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-300"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white/80 backdrop-blur-sm"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="w-full bg-gray-100 h-1.5 flex-shrink-0">
          <div className="bg-emerald-500 h-1.5 w-full"></div>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto flex-1">
          <div className="animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 pr-8">Welcome to Hass Properties!</h2>
            <p className="text-gray-600 mb-6">To help us personalize your experience, what are you looking for today?</p>

            <div className="space-y-3">
              <button onClick={() => handleGoalSelect('buy_home')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Buy a Home</h3>
                  <p className="text-sm text-gray-500">Find your dream house or apartment</p>
                </div>
              </button>

              <button onClick={() => handleGoalSelect('rent')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Rent a Property</h3>
                  <p className="text-sm text-gray-500">Houses, apartments, and rooms for rent</p>
                </div>
              </button>

              <button onClick={() => handleGoalSelect('land')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Map className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Buy Land</h3>
                  <p className="text-sm text-gray-500">Plots, farms, and development land</p>
                </div>
              </button>

              <button onClick={() => handleGoalSelect('commercial')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Commercial Space</h3>
                  <p className="text-sm text-gray-500">Offices, shops, and warehouses</p>
                </div>
              </button>

              <button onClick={() => handleGoalSelect('cars')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Buy a Car</h3>
                  <p className="text-sm text-gray-500">Sedans, trucks, pickups, and vans</p>
                </div>
              </button>

              <button onClick={() => handleGoalSelect('motorcycles')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Bike className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Buy a Motorcycle</h3>
                  <p className="text-sm text-gray-500">Boda bodas, sports bikes, and scooters</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
