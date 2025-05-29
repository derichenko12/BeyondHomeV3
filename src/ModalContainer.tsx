// src/ModalContainer.tsx
import React from "react";
import { useCart } from "./CartContext";

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
    { id: 'creative', label: 'SPACES' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Фоновая картинка с блюром */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/images/background.jpg)',
          transform: 'scale(1.2)'
        }}
      />
      
      {/* Затемнение поверх блюра */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Верхняя навигация */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start">
        {/* Левый верхний угол - дата и время */}
        <div className="text-white text-sm">
          <div>BARCELONA, 29.05.2025</div>
          <div className="text-xs opacity-70">01:17</div>
        </div>
        
        {/* Правый верхний угол - две корзины */}
        <div className="flex gap-4">
          {/* Корзина денег */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white text-sm">
            <span className="opacity-70">€</span>
            <span className="ml-1 font-medium">{totalCost.toLocaleString()}</span>
          </div>
          
          {/* Корзина времени */}
          {totalTime > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white text-sm">
              <span className="opacity-70">⏱</span>
              <span className="ml-1 font-medium">{totalTime}h/week</span>
            </div>
          )}
        </div>
      </nav>
      
      {/* Нижняя навигация по шагам */}
      <nav className="absolute bottom-0 left-0 z-20 p-6">
        <div className="flex gap-6 text-sm font-light">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => onStepChange && onStepChange(s.id)}
              className={`
                transition-all duration-200 tracking-wider
                ${step === s.id 
                  ? 'text-white' 
                  : 'text-white/30 hover:text-white/60'
                }
              `}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>
      
      {/* Модальное окно */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        {/* Контейнер с градиентной обводкой */}
        <div 
          className="relative rounded-[30px] p-[0.5px]"
          style={{
            background: 'linear-gradient(195deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
            maxWidth: '768px',
            width: '100%'
          }}
        >
          {/* Внутренний контейнер */}
          <div 
            className="rounded-[30px] overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(86px)',
              WebkitBackdropFilter: 'blur(86px)',
            }}
          >
            {/* Контент */}
            <div className="relative p-8 md:p-12 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};