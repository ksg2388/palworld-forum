import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="w-full min-w-[1000px] bg-gray-800 text-white">
      <div className="max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-between py-8">
        <div className="flex items-start gap-16 mb-5">
          <div>
            <Link href="/" className="w-[119px] h-[32px] relative">
              <div className="w-[140px] h-[38px] relative">
                <Image src="/images/logo-palworld.webp" alt="logo" fill className="brightness-0 invert" />
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-2 flex-[2]">
            <p className="text-gray-400 text-sm">
              팔월드 공식 커뮤니티
            </p>
            <p className="text-gray-400 text-sm max-w-[400px]">
              팔월드 유저들을 위한 공식 커뮤니티 사이트입니다. 게임 정보와 유저들간의 소통을 위한 공간을 제공합니다.
            </p>
          </div>

          <div className="flex flex-col gap-4 flex-[1]">
            <div>
              <h3 className="font-bold mb-2">관계자</h3>
              <ul className="space-y-1">
                <li className="text-gray-400 text-sm">운영진: 팔월드 코리아</li>
                <li className="text-gray-400 text-sm">개발: 웹 개발팀</li>
                <li className="text-gray-400 text-sm">디자인: UI/UX팀</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="w-[160px] h-[80px] relative">
                <Image 
                  src={`/images/test-image.png`} 
                  alt={`footer image ${num}`}
                  fill 
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Palworld Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer