
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { quizQuestions } from '../data/quizData';

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (optionKey: string) => {
    setSelectedOption(optionKey);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption('');
    } else {
      // 计算结果并跳转
      const result = calculateResult(newAnswers);
      localStorage.setItem('quizResult', JSON.stringify({
        answers: newAnswers,
        result: result
      }));
      navigate('/result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || '');
      setAnswers(answers.slice(0, -1));
    }
  };

  const calculateResult = (userAnswers: string[]) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    userAnswers.forEach((answer, index) => {
      const question = quizQuestions[index];
      const option = question.options.find(opt => opt.key === answer);
      if (option) {
        option.traits.forEach(trait => {
          scores[trait as keyof typeof scores]++;
        });
      }
    });

    const personality = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N', 
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P'
    ].join('');

    // 根据MBTI类型匹配Labubu角色
    const characterMap: { [key: string]: string } = {
      'ENFP': 'Labubu', 'ESFP': 'Labubu', 'ENFJ': 'Labubu', 'ESFJ': 'Labubu',
      'INFP': 'Zimomo', 'ISFP': 'Zimomo', 'INFJ': 'Zimomo', 'ISFJ': 'Zimomo',
      'ENTP': 'Mokoko', 'ESTP': 'Mokoko', 'ENTJ': 'Mokoko', 'ESTJ': 'Mokoko',
      'INTP': 'Spooky', 'ISTP': 'Spooky', 'INTJ': 'Spooky', 'ISTJ': 'Spooky'
    };

    return {
      character: characterMap[personality] || 'Labubu',
      personality,
      scores,
      detailedAnalysis: generateDetailedAnalysis(personality, scores, userAnswers)
    };
  };

  const generateDetailedAnalysis = (personality: string, scores: any, userAnswers: string[]) => {
    // 根据具体答题情况生成个性化分析
    const traits = [];
    
    if (scores.E > scores.I) {
      traits.push("你是一个外向型的人，喜欢与他人交流，从社交中获得能量");
    } else {
      traits.push("你更倾向于内向，喜欢独处思考，从内心世界获得力量");
    }

    if (scores.S > scores.N) {
      traits.push("你注重现实和细节，喜欢具体可行的解决方案");
    } else {
      traits.push("你富有想象力，喜欢探索可能性和创新想法");
    }

    if (scores.T > scores.F) {
      traits.push("你倾向于理性思考，重视逻辑和客观分析");
    } else {
      traits.push("你重视情感和价值观，善于理解他人的感受");
    }

    if (scores.J > scores.P) {
      traits.push("你喜欢有计划有组织的生活，追求确定性");
    } else {
      traits.push("你适应性强，喜欢灵活性和自由度");
    }

    return traits;
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* 头部进度 */}
      <div className="max-w-2xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-gray-600">
            {currentQuestion + 1} / {quizQuestions.length}
          </span>
          <div className="w-8"></div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 问题内容 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <Button
                  key={option.key}
                  variant={selectedOption === option.key ? "default" : "outline"}
                  className={`w-full p-6 text-left justify-start text-wrap h-auto transition-all duration-300 transform hover:scale-105 ${
                    selectedOption === option.key 
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg scale-105' 
                      : 'hover:bg-pink-50 hover:border-pink-300'
                  }`}
                  onClick={() => handleAnswerSelect(option.key)}
                >
                  <span className="text-lg font-medium mr-4">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-lg leading-relaxed">{option.text}</span>
                </Button>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleNext}
                disabled={!selectedOption}
                size="lg"
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full disabled:opacity-50 transform transition-all duration-300 hover:scale-105"
              >
                {currentQuestion === quizQuestions.length - 1 ? '查看结果' : '下一题'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
