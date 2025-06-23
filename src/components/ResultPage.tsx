import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Heart, Download } from 'lucide-react';
import { characterData } from '../data/characterData';
import html2canvas from 'html2canvas';

const ResultPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('quizResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
      setTimeout(() => setShowAnimation(true), 500);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleDownloadReport = async () => {
    if (!reportRef.current || !result) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: 'transparent',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        height: reportRef.current.scrollHeight,
        width: reportRef.current.scrollWidth
      });
      
      const link = document.createElement('a');
      link.download = `${character.name}性格测试报告.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('生成报告失败:', error);
      alert('生成报告失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  const character = characterData[result.result.character];
  const bgColorClass = character.bgColor;

  return (
    <div className={`min-h-screen ${bgColorClass} relative overflow-hidden`}>
      {/* 装饰元素 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-bounce">
          <Heart className="text-white/30 w-8 h-8" fill="currentColor" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Sparkles className="text-white/40 w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-300">
          <Heart className="text-white/20 w-6 h-6" fill="currentColor" />
        </div>
      </div>

      <div className="relative z-10 p-4">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回首页
        </Button>

        <div className="max-w-2xl mx-auto">
          {/* 可下载的报告区域 */}
          <div ref={reportRef} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-6 shadow-xl">
            {/* 角色展示区域 */}
            <div className={`text-center mb-8 ${showAnimation ? 'animate-scale-in' : 'opacity-0'}`}>
              <div className="relative mb-6">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-48 h-48 mx-auto rounded-3xl shadow-2xl object-cover"
                />
                <div className="absolute -top-2 -right-2">
                  <div className="bg-yellow-400 rounded-full p-2">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                你是 {character.name}！
              </h1>
              <p className="text-lg text-gray-600 font-medium mb-4">
                {character.subtitle}
              </p>
              <div className="text-4xl mb-4">{character.emoji}</div>
            </div>

            {/* 专属语录 */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
              <blockquote className="text-lg italic text-gray-700 leading-relaxed text-center">
                "{character.quote}"
              </blockquote>
            </div>

            {/* 性格解析 */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                专属性格解析
              </h3>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">你的MBTI类型：{result.result.personality}</h4>
                <p className="text-gray-600 leading-relaxed">{character.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-lg font-semibold text-gray-700">个性化分析：</h4>
                {result.result.detailedAnalysis.map((trait: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-pink-100 rounded-full p-1 mt-1">
                      <Heart className="w-3 h-3 text-pink-500" fill="currentColor" />
                    </div>
                    <p className="text-gray-600 leading-relaxed">{trait}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">性格特质：</h4>
                <div className="flex flex-wrap gap-2">
                  {character.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 shadow-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 测试信息 */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Labubu 性格测试报告</p>
              <p>基于 MBTI 心理学理论 · 专业性格分析</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${showAnimation ? 'animate-fade-in delay-1000' : 'opacity-0'}`}>
            <Button
              onClick={handleDownloadReport}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              {isGenerating ? '生成中...' : '下载报告'}
            </Button>

            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="bg-white/90 hover:bg-white text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-5 h-5 mr-2" fill="currentColor" />
              再测一次
            </Button>
            
            <Button
              onClick={() => {
                // 分享功能可以后续添加
                alert('分享功能开发中～');
              }}
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/20 font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              分享结果
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
