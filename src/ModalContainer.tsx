// src/ModalContainer.tsx
import React from "react";
import { useCart } from "./CartContext";
import Cart from "./Cart";

interface ModalContainerProps {
  children: React.ReactNode;
  step?: string;
  onStepChange?: (step: string) => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ 
  children, 
  step,
  onStepChange 
}) => {
  const { items } = useCart();
  
  // Разделяем items на деньги и время
  const moneyItems = items.filter(item => item.type !== "time");
  const timeItems = items.filter(item => item.type === "time");
  
  // Считаем только average время (не peak)
  const avgTimeItems = timeItems.filter(item => item.label.includes("(avg)"));
  const resourceTimeItems = timeItems.filter(item => 
    !item.label.includes("(avg)") && !item.label.includes("(peak)")
  );
  
  const totalCost = moneyItems.reduce((sum, item) => sum + item.value, 0);
  const totalTime = avgTimeItems.reduce((sum, item) => sum + item.value, 0) + 
                    resourceTimeItems.reduce((sum, item) => sum + item.value, 0);

  const steps = [
    { id: 'welcome', label: 'INTRO' },
    { id: 'tags', label: 'TAGS' },
    { id: 'subregions', label: 'REGION' },
    { id: 'family', label: 'FAMILY' },
    { id: 'land', label: 'LAND' },
    { id: 'living', label: 'HOME' },
    { id: 'food', label: 'FOOD' },
    { id: 'resources', label: 'RESOURCES' },
    { id: 'creative', label: 'CREATIVE' },
    { id: 'receipt', label: 'RECEIPT' },
  ];

  // Get current date in format
  const getCurrentDateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-900">
      {/* Фоновая картинка с блюром */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970)',
          filter: 'blur(20px)',
          transform: 'scale(1.2)'
        }}
      />
      
      {/* Затемнение поверх блюра */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Верхняя навигация */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start">
        {/* Левый верхний угол - дата и время */}
        <div className="text-white text-sm font-light">
          <div className="tracking-wide">BARCELONA, SPAIN</div>
          <div className="text-xs opacity-70">{getCurrentDateTime()}</div>
        </div>
        
        {/* Правый верхний угол - две корзины */}
        <div className="flex gap-4">
          {/* Корзина денег */}
          {totalCost > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm flex items-center gap-2">
              <span className="opacity-70">€</span>
              <span className="font-light">{totalCost.toLocaleString()}</span>
            </div>
          )}
          
          {/* Корзина времени */}
          {totalTime > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm flex items-center gap-2">
              <span className="opacity-70">⏱</span>
              <span className="font-light">{totalTime}h/week</span>
            </div>
          )}
        </div>
      </nav>
      
      {/* Нижняя навигация по шагам */}
      <nav className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="flex gap-8 text-xs font-light justify-center">
          {steps.map((s, index) => {
            const stepOrder = steps.map(st => st.id);
            const currentIndex = stepOrder.indexOf(step || '');
            const thisIndex = index;
            const isAccessible = thisIndex <= currentIndex;
            
            return (
              <button
                key={s.id}
                onClick={() => isAccessible && onStepChange && onStepChange(s.id)}
                disabled={!isAccessible}
                className={`
                  transition-all duration-300 tracking-wider uppercase
                  ${step === s.id 
                    ? 'text-white font-normal' 
                    : isAccessible 
                      ? 'text-white/40 hover:text-white/70 cursor-pointer' 
                      : 'text-white/20 cursor-not-allowed'
                  }
                `}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Модальное окно */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        {/* Контейнер с градиентной обводкой */}
        <div 
          className="relative rounded-3xl p-[1px] max-w-4xl w-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
          }}
        >
          {/* Внутренний контейнер */}
          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            {/* Контент */}
            <div className="relative p-8 md:p-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Стили для кастомного скролла */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};