import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface AICoachChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AICoachChat({ isOpen, onClose }: AICoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Namaste! 🙏 I am your FabHab AI Wellness Coach. Let\'s optimize your health with a blend of Desi diet advice and Ayurvedic routines. What is on your mind today?',
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: inputVal,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Simulate Bot response
    setTimeout(() => {
      let responseText = '';
      const query = inputVal.toLowerCase();

      if (query.includes('chai') || query.includes('tea') || query.includes('coffee')) {
        responseText = '☕ Ah, Chai! It\'s a daily ritual for many Indians. However, excess chai (especially with sugar) spikes cortisol and impacts digestion. Keep it to 2 cups max, and try replacing your late-afternoon cup with Tulsi Green Tea or hot water!';
      } else if (query.includes('roti') || query.includes('rice') || query.includes('biryani') || query.includes('diet') || query.includes('lunch') || query.includes('dinner')) {
        responseText = '🍲 Indian meals are delicious but often carb-heavy. Try the 50-25-25 rule: fill half your plate with Sabzi/Salad, 25% with protein (Paneer, Dal, Sprouts, or Chicken), and 25% with complex carbs like Jowar/Ragi Roti or Brown Rice instead of white rice.';
      } else if (query.includes('yoga') || query.includes('exercise') || query.includes('surya') || query.includes('fitness')) {
        responseText = '🧘 A perfect Desi routine starts with 10–12 rounds of Surya Namaskar (Sun Salutations) in the morning for full-body flexibility. Pair it with Kapalbhati or Anulom Vilom Pranayama to boost lung health and calm your nervous system!';
      } else if (query.includes('sleep') || query.includes('night') || query.includes('insomnia')) {
        responseText = '🌙 For better sleep, try "Shatavari Walk" (taking 100 steps after dinner). Also, drinking warm Haldi Doodh (Turmeric Milk) with a pinch of nutmeg or Ashwagandha before bed works wonders for relaxation.';
      } else if (query.includes('water') || query.includes('hydration') || query.includes('matka')) {
        responseText = '🏺 Drinking water stored in a clay Matka naturally cools the water, balances its pH (alkaline nature), and boosts metabolism. Aim for 8 glasses daily!';
      } else if (query.includes('weight') || query.includes('fat') || query.includes('belly')) {
        responseText = '⚖️ To manage weight, start by cutting down processed snacks (Samosas, Namkeen) and replacement with roasted Makhana or Chana. Increase your daily step count using our Vitals tracker to reach 10,000 steps.';
      } else {
        responseText = '💡 That\'s interesting! I recommend pairing a daily walk with 10 minutes of Pranayama. Focus on home-cooked meals (Ghar ka khana) and log your calories on your Desi Wellness Hub to see consistency.';
      }

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-slate-900 text-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-violet-600 to-purple-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Desi AI Health Coach</h3>
                  <span className="text-xs text-violet-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
                    Ayurvedic & Diet Expert
                  </span>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-violet-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
              <Input
                placeholder="Ask about Chai, Biryani, Surya Namaskar..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 rounded-xl"
              />
              <Button onClick={handleSend} className="bg-violet-600 hover:bg-violet-700 rounded-xl px-4 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
