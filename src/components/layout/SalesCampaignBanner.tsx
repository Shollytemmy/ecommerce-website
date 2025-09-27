'use client';

import React from 'react'
import { useRouter } from 'next/navigation';

const SalesCampaignBanner = () => {

  const router = useRouter()
  return (
    <div className='w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-600 py-3 relative overflow-hidden'>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold animate-bounce">🔥</span>
            <div className="text-sm sm:text-base font-bold">
              FLASH SALES END IN:
            </div>
            <div className="px-2 py-1 bg-white/20 font-mono font-bold rounded">23:59:59</div>

          </div>
          <div className="flex items-center gap-2">
          <span className="text-xl font-bold">⚡</span>
          <span className="font-bold text-xl animate-pulse text-yellow-200">
            UP TO 95% OFF !
          </span>
          </div>
          <button
            onClick={() => router.push('/') }
            className="bg-white text-red-600 px-4 py-1 rounded-full hover:bg-yellow-100 transition-colors font-bold text-sm">
            SHOP NOW
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default SalesCampaignBanner