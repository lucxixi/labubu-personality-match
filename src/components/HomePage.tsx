
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 装饰元素 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-bounce">
          <Heart className="text-pink-300 w-8 h-8" fill="currentColor" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Sparkles className="text-purple-300 w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-300">
          <Heart className="text-blue-300 w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse delay-500">
          <Sparkles className="text-pink-400 w-8 h-8" />
        </div>
      </div>

      <div className="text-center max-w-md mx-auto relative z-10">
        {/* 主标题 */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            测测你是哪种 Labubu？
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-6"></div>
        </div>

        {/* 角色欢迎语 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-lg animate-scale-in">
          <div className="text-6xl mb-4 animate-bounce">🌟</div>
          <p className="text-gray-700 text-lg leading-relaxed">
            欢迎来到神奇的 Labubu 世界！
            <br />
            通过心理测试，发现你的专属角色
            <br />
            <span className="text-pink-500 font-semibold">每个人都有独特的魅力✨</span>
          </p>
        </div>

        {/* 开始按钮 */}
        <Button
          onClick={() => navigate('/quiz')}
          size="lg"
          className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl animate-bounce"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          开始神奇测试
          <Heart className="w-5 h-5 ml-2" fill="currentColor" />
        </Button>

        {/* 提示文字 */}
        <p className="text-sm text-gray-500 mt-4 animate-fade-in delay-1000">
          基于专业心理学测试 · 25题精准匹配
        </p>
      </div>
    </div>
  );
};

export default HomePage;
