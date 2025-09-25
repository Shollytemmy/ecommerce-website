'use client';

import { User } from '@/generated/prisma';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { logOut } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import HeaderSearchBar from './HeaderSearchBar';
import { useShallow } from 'zustand/shallow';
import { useCartStore } from '@/stores/cart-stores';



type HeaderProps = {
    user: Omit<User, 'passwordHash'> | null;
    categorySelector: React.ReactNode;
};

const AnnouncementBar = () => {
    return (
        <div className="w-full bg-black py-2">
        <div className="container mx-auto flex items-center justify-center px-8-8 ">
          <span className="text-center text-white text-sm font-medium tracking-wide">FREE SHIPPING ON ORDER OVER $50.00 x FREE RETURNS ON ALL ORDER</span>
            </div>
        </div>
    )
}
const Header = ({user, categorySelector}: HeaderProps) => {
const { open, getTotalItems } = useCartStore(
        useShallow((state) => ({
            open: state.open,
            getTotalItems: state.getTotalItems
        }))
    );

  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [prevScollY, setPrevScrollY] = useState<number>(0)

  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolledUp = currentScrollY < prevScollY;

      if (scrolledUp) {
        setIsOpen(true)
      } else if (currentScrollY > 100) {
        setIsOpen(false)
      }

      setPrevScrollY(currentScrollY)
     }
    
    setPrevScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll)

    return () => {
     window.removeEventListener('scroll', handleScroll)
    }

  }, [prevScollY])




  return (
    <header className='w-full sticky top-0 z-50'>
      <div className={`w-full transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <AnnouncementBar />
        <div className="w-full flex items-center justify-between py-3 sm:py-4 bg-white/80 shadow-sm border-b border-gray-100 backdrop-blur-sm">
          <div className="container mx-auto px-8 flex items-center justify-center">
            <div className="flex flex-1 justify-start items-center gap-4 sm:gap-6">
               <button className='text-gray-700 hover:text-gray-900 md:hidden'>
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 sm:h-6 sm:w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                                </svg>
              </button>
              <nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium">
                <Link href='#'>Sales</Link>
                {categorySelector}
              </nav>
            </div>
            <Link href='#' className=''>DEALS</Link>
            <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
              <HeaderSearchBar />
              {user ? (
                                <div className='flex items-center gap-2 sm:gap-4'>
                                    <span className='text-sm text-gray-700 hidden md:block'>{user.email}</span>
                                    <Link
                                        href='#'
                                        className='text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900'
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await logOut();
                                            router.refresh();
                                        }}
                                    >
                                        Sign Out
                                    </Link>
                                </div>
                            ) : (
                                <React.Fragment>
                                    <Link href='/auth/sign-in' className='text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900'>
                                        Sign In
                                    </Link>
                                    <Link href='/auth/sign-up' className='text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900'>
                                        Sign Up
                                    </Link>
                                </React.Fragment>
                            )}
              {/* <Link href='/auth/sign-in'>Sign In</Link>
              <Link href='/auth/sign-up'>Sign Up</Link> */}
              <button onClick={() => open()} className="text-gray-700 hover:text-red-900 relative cursor-pointer">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 sm:h-6 sm:w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-white bg-black text-[10px] sm:text-xs rounded-full sm:w-4 sm:h-4 flex items-center justify-center cursor-pointer">{getTotalItems()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header