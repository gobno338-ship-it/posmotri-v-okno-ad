/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Video } from './types';
import { MOCK_VIDEOS } from './constants';

export default function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  
  // Search state
  const [searchCity, setSearchCity] = useState('');
  const [searchTimes, setSearchTimes] = useState<string[]>([]);

  useEffect(() => {
    // Simulate initial fetch
    const timer = setTimeout(() => {
      setVideos(MOCK_VIDEOS);
      setDisplayedVideos(MOCK_VIDEOS.slice(0, 5));
      setCurrentVideo(MOCK_VIDEOS[0]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const filtered = MOCK_VIDEOS.filter(v => {
        const cityMatch = v.city.toLowerCase().includes(searchCity.toLowerCase());
        const timeMatch = searchTimes.length === 0 || searchTimes.includes(v.time);
        return cityMatch && timeMatch;
      });

      if (filtered.length === 0) {
        setError('нет подходящих видео =(');
      }
      
      setVideos(filtered);
      setDisplayedVideos(filtered.slice(0, 5));
      setVisibleCount(5);
      if (filtered.length > 0) {
        setCurrentVideo(filtered[0]);
      } else {
        setCurrentVideo(null);
      }
      setLoading(false);
    }, 1000);
  };

  const handleShowMore = () => {
    const nextCount = visibleCount + 5;
    setDisplayedVideos(videos.slice(0, nextCount));
    setVisibleCount(nextCount);
  };

  const toggleTime = (time: string) => {
    setSearchTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  return (
    <div className="page min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-bg">
      <main className="content w-full max-w-[1140px] grid grid-cols-1 md:grid-cols-[711px_1fr] gap-[30px] items-end">
        
        {/* Left Column: Video & Search Form */}
        <div className="flex flex-col gap-4 w-full">
          <section className="result w-full flex flex-col gap-4">
            <div className="result__video-container relative w-full h-[386px] bg-gray border-[5px] border-white/10 rounded-sm overflow-hidden">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-bg/80 z-10"
                  >
                    <Loader2 className="w-12 h-12 animate-spin text-white" />
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <AlertCircle className="w-16 h-16 mb-4 text-gray" />
                    <h2 className="font-display text-3xl font-bold uppercase leading-[1.1]">{error}</h2>
                  </motion.div>
                ) : currentVideo ? (
                  <motion.div 
                    key={currentVideo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full bg-gray flex items-center justify-center"
                  >
                    {/* Empty Placeholder for video */}
                    <div className="w-full h-full bg-gray/50 border-2 border-dashed border-white/10" />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSearch} className="search-form flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-8 w-full">
                {/* City Input */}
                <div className="search-form__city flex flex-col gap-1 flex-grow">
                  <label className="search-form__label flex flex-col gap-1 w-fit">
                    <span className="search-form__fieldset-title font-sans font-normal text-lg">Город</span>
                    <input 
                      type="text" 
                      placeholder="Санкт-Петербург, например"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="search-form__input appearance-none bg-transparent border-y border-white text-white font-sans font-normal text-lg py-3 px-2 focus:outline-none focus-visible:outline-white leading-normal"
                    />
                  </label>
                </div>

                {/* Time Checkboxes */}
                <fieldset className="search-form__time border-none p-0 flex flex-col gap-1">
                  <legend className="search-form__fieldset-title font-sans font-normal text-lg mb-1">Время суток</legend>
                  <div className="search-form__checkbox-list flex gap-4">
                    {[
                      { id: 'morning', label: 'Утро' },
                      { id: 'day', label: 'День' },
                      { id: 'night', label: 'Ночь' }
                    ].map((t) => (
                      <label key={t.id} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="visually-hidden"
                          checked={searchTimes.includes(t.id)}
                          onChange={() => toggleTime(t.id)}
                        />
                        <span className={`search-form__pseudo-checkbox w-5 h-5 border border-white flex items-center justify-center relative group-focus-within:outline group-focus-within:outline-white`}>
                          {searchTimes.includes(t.id) && (
                            <span className="w-3 h-3 bg-white" />
                          )}
                        </span>
                        <span className="font-sans font-normal text-lg group-hover:underline">
                          {t.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <button 
                type="submit" 
                className="button search-form__submit-button w-full sm:w-[194px] h-[34px] border border-white bg-transparent text-white font-display font-bold text-lg uppercase cursor-pointer hover:underline active:bg-gray focus:outline-none focus-visible:outline-white"
              >
                Найти
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Title & Cards */}
        <div className="content__details w-full h-full flex flex-col gap-[26px]">
          {/* 1. Title at the top */}
          <h1 className="title font-display text-[75px] font-bold leading-[1.1] uppercase">
            <span className="opacity-20 uppercase">по-</span><br />
            смотри<br />
            в окно
          </h1>

          {/* 2. List Container - Sized to fit exactly 2 cards */}
          <div className="content__list-container relative flex-grow overflow-y-auto h-[280px] max-h-[280px] pr-2">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <ul className="flex flex-col gap-[30px] py-2">
                  {displayedVideos.map((video) => (
                    <li key={video.id} className="content__list-item px-[3px]">
                      <button 
                        onClick={() => setCurrentVideo(video)}
                        className={`content__card-link w-full text-left flex items-center gap-4 p-2 transition-colors hover:underline focus:outline-none focus-visible:outline-white ${currentVideo?.id === video.id ? 'bg-gray' : ''}`}
                      >
                        <div className="content__video-card-description-container flex-grow flex flex-col gap-2 overflow-hidden">
                          <h3 className="content__video-card-title font-display font-bold text-3xl uppercase leading-normal py-2">{video.title}</h3>
                          <p className="content__video-card-description font-sans font-normal text-lg leading-relaxed line-clamp-2">{video.description}</p>
                        </div>
                        <div className="content__video-card-thumbnail w-[194px] h-[103px] flex-shrink-0 bg-gray border border-white/10 overflow-hidden flex items-center justify-center">
                          {/* Empty Placeholder for image */}
                          <div className="w-full h-full bg-gray/30 border border-dashed border-white/10" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </div>
          
          {/* 3. More Button at the bottom */}
          {visibleCount < videos.length && !loading && (
            <button 
              onClick={handleShowMore}
              className="button more-button w-full h-[34px] border border-white bg-transparent text-white font-display font-bold text-lg uppercase cursor-pointer hover:underline active:bg-gray focus:outline-none focus-visible:outline-white mt-auto"
            >
              Показать ещё
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
