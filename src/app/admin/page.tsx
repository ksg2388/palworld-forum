"use client";

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const MembersTab = dynamic(() => import('../_components/admin/MembersTab'), { ssr: false });
const BannerTab = dynamic(() => import('../_components/admin/BannerTab'), { ssr: false });
const FooterTab = dynamic(() => import('../_components/admin/FooterTab'), { ssr: false });
const LinksTab = dynamic(() => import('../_components/admin/LinksTab'), { ssr: false });
const RulesTab = dynamic(() => import('../_components/admin/RulesTab'), { ssr: false });
const ApplicationsTab = dynamic(() => import('../_components/admin/ApplicationsTab'), { ssr: false });
const ConnectionTab = dynamic(() => import('../_components/admin/ConnectionTab'), { ssr: false });

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-[140px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">관리자 페이지</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex flex-wrap">
              {[
                { id: 'members', label: '회원 관리' },
                { id: 'banner', label: '배너 이미지' },
                { id: 'footer', label: '푸터 메시지' },
                { id: 'rules', label: '서버 규칙' },
                { id: 'applications', label: '서버 입주신청' },
                { id: 'connection', label: '서버 연결 방법' },
                { id: 'links', label: '링크 관리' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-gray-800 text-gray-800'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'members' && <MembersTab />}
            {activeTab === 'banner' && <BannerTab />}
            {activeTab === 'footer' && <FooterTab />}
            {activeTab === 'links' && <LinksTab />}
            {activeTab === 'rules' && <RulesTab />}
            {activeTab === 'applications' && <ApplicationsTab />}
            {activeTab === 'connection' && <ConnectionTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;