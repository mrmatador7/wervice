'use client';

import { useState } from 'react';
import { Pin, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

// Mock data for generated images
const mockImages = [
  {
    id: 1,
    url: '/images/sample/venues-1.jpg',
    title: 'A futuristic cityscape at sunset with neon lights and flying cars',
    tags: ['Cyberpunk', 'Dalle-3'],
    size: '1024x1024',
  },
  {
    id: 2,
    url: '/images/sample/venues-2.jpg',
    title: 'Peaceful zen garden with cherry blossoms and koi pond in spring',
    tags: ['Realistic', 'Midjourney'],
    size: '1024x1024',
  },
  {
    id: 3,
    url: '/public/categories/venues.png',
    title: 'Abstract geometric patterns in vibrant colors',
    tags: ['Abstract', 'Dalle-3'],
    size: '1024x1024',
  },
  {
    id: 4,
    url: '/images/sample/venues-3.jpg',
    title: 'Mountain landscape at golden hour with dramatic clouds',
    tags: ['Landscape', 'Midjourney'],
    size: '1024x1024',
  },
];

export default function DashboardPage() {
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:2'];

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">MA</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mrdl Admin</h2>
              <p className="text-sm text-gray-500">Product Designer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Pin size={18} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <textarea
            placeholder="Describe your image... (e.g., A serene landscape with mountains at sunset, highly detailed, 4k)"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white resize-none transition-all"
            rows={3}
          />
        </div>

        {/* Model and Aspect Ratio */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option>Select an Model</option>
              <option>DALL-E 3</option>
              <option>Midjourney</option>
              <option>Stable Diffusion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aspect ratio</label>
            <div className="flex gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setSelectedAspect(ratio)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedAspect === ratio
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Images Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {mockImages.slice(0, 3).map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            </div>
          ))}
        </div>

        {/* Generate More Button */}
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all">
          + Generate more variations
        </button>

        {/* Bottom Actions */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Image to image</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span>Style Preset</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Reference</span>
          </button>
          <button className="ml-auto px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* Generated Images Gallery */}
      <div className="grid grid-cols-2 gap-6">
        {mockImages.map((image) => (
          <div key={image.id} className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2">
              {image.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              {image.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{image.size}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
