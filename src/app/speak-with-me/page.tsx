"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Square, FastForward, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const PARAGRAPHS = [
  "The art of effective communication isn't just about the words you choose, but the rhythm, pace, and clarity with which you deliver them. When you speak slightly faster than your normal conversational cadence, you challenge your brain to process thoughts more rapidly while maintaining precise articulation. This exercise trains your vocal cords to remain steady under pressure and helps eliminate filler words. Keep breathing, stay focused, and let the words flow naturally as they appear before you. Mastery of your own voice is the first step toward leadership, influence, and impact. Every great leader in history was first and foremost a master of the spoken word, using it to move mountains and change minds. As you practice this daily, you will find that your confidence grows exponentially, and your ability to persuade and inspire becomes a natural part of who you are. The journey of a thousand miles begins with a single step, and the journey to vocal mastery begins with a single word spoken with conviction. Do not fear the speed; embrace it. Let the velocity of the text propel your thoughts forward. Clarity is your anchor, and pace is your sail. Navigate the sea of language with the precision of a master mariner. Your voice is a tool, a weapon, and a gift—use it wisely and use it often. The more you speak, the more you learn. The more you learn, the more you grow. The more you grow, the more you can contribute to the world around you. This is the path of the orator, the path of the leader, and the path of the true communicator. " + "The art of effective communication isn't just about the words you choose, but the rhythm, pace, and clarity with which you deliver them. When you speak slightly faster than your normal conversational cadence, you challenge your brain to process thoughts more rapidly while maintaining precise articulation. This exercise trains your vocal cords to remain steady under pressure and helps eliminate filler words. Keep breathing, stay focused, and let the words flow naturally as they appear before you. Mastery of your own voice is the first step toward leadership, influence, and impact. Every great leader in history was first and foremost a master of the spoken word, using it to move mountains and change minds. As you practice this daily, you will find that your confidence grows exponentially, and your ability to persuade and inspire becomes a natural part of who you are. The journey of a thousand miles begins with a single step, and the journey to vocal mastery begins with a single word spoken with conviction. Do not fear the speed; embrace it. Let the velocity of the text propel your thoughts forward. Clarity is your anchor, and pace is your sail. Navigate the sea of language with the precision of a master mariner. Your voice is a tool, a weapon, and a gift—use it wisely and use it often. The more you speak, the more you learn. The more you learn, the more you grow. The more you grow, the more you can contribute to the world around you. This is the path of the orator, the path of the leader, and the path of the true communicator. " + "The art of effective communication isn't just about the words you choose, but the rhythm, pace, and clarity with which you deliver them. When you speak slightly faster than your normal conversational cadence, you challenge your brain to process thoughts more rapidly while maintaining precise articulation. This exercise trains your vocal cords to remain steady under pressure and helps eliminate filler words. Keep breathing, stay focused, and let the words flow naturally as they appear before you. Mastery of your own voice is the first step toward leadership, influence, and impact. Every great leader in history was first and foremost a master of the spoken word, using it to move mountains and change minds. As you practice this daily, you will find that your confidence grows exponentially, and your ability to persuade and inspire becomes a natural part of who you are. The journey of a thousand miles begins with a single step, and the journey to vocal mastery begins with a single word spoken with conviction. Do not fear the speed; embrace it. Let the velocity of the text propel your thoughts forward. Clarity is your anchor, and pace is your sail. Navigate the sea of language with the precision of a master mariner. Your voice is a tool, a weapon, and a gift—use it wisely and use it often. The more you speak, the more you learn. The more you learn, the more you grow. The more you grow, the more you can contribute to the world around you. This is the path of the orator, the path of the leader, and the path of the true communicator.",
  "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where's the peck of pickled peppers Peter Piper picked? How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood. Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter. But a bit of better butter will make my batter better. So 'twas better Betty Botter bought a bit of better butter. She sells seashells by the seashore. The shells she sells are seashells, I'm sure. So if she sells seashells on the seashore, then I'm sure she sells seashore shells. Red leather, yellow leather. Red leather, yellow leather. Red leather, yellow leather. Unique New York. Unique New York. You know New York, you need New York, you know you need unique New York. I slit the sheet, the sheet I slit, and on the slitted sheet I sit. A proper copper coffee pot. A proper copper coffee pot. A proper copper coffee pot. Rubber baby buggy bumpers. Rubber baby buggy bumpers. Rubber baby buggy bumpers. Which witch is which? Which witch is which? Which witch is which? " + "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where's the peck of pickled peppers Peter Piper picked? How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood. Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter. But a bit of better butter will make my batter better. So 'twas better Betty Botter bought a bit of better butter. She sells seashells by the seashore. The shells she sells are seashells, I'm sure. So if she sells seashells on the seashore, then I'm sure she sells seashore shells. Red leather, yellow leather. Red leather, yellow leather. Red leather, yellow leather. Unique New York. Unique New York. You know New York, you need New York, you know you need unique New York. I slit the sheet, the sheet I slit, and on the slitted sheet I sit. A proper copper coffee pot. A proper copper coffee pot. A proper copper coffee pot. Rubber baby buggy bumpers. Rubber baby buggy bumpers. Rubber baby buggy bumpers. Which witch is which? Which witch is which? Which witch is which? " + "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where's the peck of pickled peppers Peter Piper picked? How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood. Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter. But a bit of better butter will make my batter better. So 'twas better Betty Botter bought a bit of better butter. She sells seashells by the seashore. The shells she sells are seashells, I'm sure. So if she sells seashells on the seashore, then I'm sure she sells seashore shells. Red leather, yellow leather. Red leather, yellow leather. Red leather, yellow leather. Unique New York. Unique New York. You know New York, you need New York, you know you need unique New York. I slit the sheet, the sheet I slit, and on the slitted sheet I sit. A proper copper coffee pot. A proper copper coffee pot. A proper copper coffee pot. Rubber baby buggy bumpers. Rubber baby buggy bumpers. Rubber baby buggy bumpers. Which witch is which? Which witch is which? Which witch is which?",
  "Imagine standing on the edge of a vast, echoing canyon just as the sun begins to rise. The sky bleeds from deep indigo into vibrant streaks of crimson and gold. As you take a deep breath, the crisp, cold morning air fills your lungs, giving you a sudden burst of clarity and energy. You realize that every challenge you've faced has only prepared you for this moment—the moment where you speak with unwavering confidence, unmatched precision, and absolute certainty. The horizon stretches out before you, endless and full of potential, mirroring the limitless power of your own potential. You are not just a speaker; you are a force of nature, capable of shaping the world with the resonance of your voice and the conviction of your words. Stand tall, speak loud, and let the world hear the truth of your experience. The echoes of your voice will carry across the miles, touching hearts and opening minds that you never thought possible. This is your time. This is your platform. This is your legacy. " + "Imagine standing on the edge of a vast, echoing canyon just as the sun begins to rise. The sky bleeds from deep indigo into vibrant streaks of crimson and gold. As you take a deep breath, the crisp, cold morning air fills your lungs, giving you a sudden burst of clarity and energy. You realize that every challenge you've faced has only prepared you for this moment—the moment where you speak with unwavering confidence, unmatched precision, and absolute certainty. The horizon stretches out before you, endless and full of potential, mirroring the limitless power of your own potential. You are not just a speaker; you are a force of nature, capable of shaping the world with the resonance of your voice and the conviction of your words. Stand tall, speak loud, and let the world hear the truth of your experience. The echoes of your voice will carry across the miles, touching hearts and opening minds that you never thought possible. This is your time. This is your platform. This is your legacy. " + "Imagine standing on the edge of a vast, echoing canyon just as the sun begins to rise. The sky bleeds from deep indigo into vibrant streaks of crimson and gold. As you take a deep breath, the crisp, cold morning air fills your lungs, giving you a sudden burst of clarity and energy. You realize that every challenge you've faced has only prepared you for this moment—the moment where you speak with unwavering confidence, unmatched precision, and absolute certainty. The horizon stretches out before you, endless and full of potential, mirroring the limitless power of your own potential. You are not just a speaker; you are a force of nature, capable of shaping the world with the resonance of your voice and the conviction of your words. Stand tall, speak loud, and let the world hear the truth of your experience. The echoes of your voice will carry across the miles, touching hearts and opening minds that you never thought possible. This is your time. This is your platform. This is your legacy.",
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. To die—to sleep, no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to: 'tis a consummation devoutly to be wish'd. To die, to sleep; to sleep, perchance to dream—ay, there's the rub: For in that sleep of death what dreams may come, when we have shuffled off this mortal coil, must give us pause. There's the respect that makes calamity of so long life. For who would bear the whips and scorns of time, the oppressor's wrong, the proud man's contumely, the pangs of dispriz'd love, the law's delay, the insolence of office, and the spurns that patient merit of the unworthy takes, when he himself might his quietus make with a bare bodkin? " + "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. To die—to sleep, no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to: 'tis a consummation devoutly to be wish'd. To die, to sleep; to sleep, perchance to dream—ay, there's the rub: For in that sleep of death what dreams may come, when we have shuffled off this mortal coil, must give us pause. There's the respect that makes calamity of so long life. For who would bear the whips and scorns of time, the oppressor's wrong, the proud man's contumely, the pangs of dispriz'd love, the law's delay, the insolence of office, and the spurns that patient merit of the unworthy takes, when he himself might his quietus make with a bare bodkin? " + "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. To die—to sleep, no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to: 'tis a consummation devoutly to be wish'd. To die, to sleep; to sleep, perchance to dream—ay, there's the rub: For in that sleep of death what dreams may come, when we have shuffled off this mortal coil, must give us pause. There's the respect that makes calamity of so long life. For who would bear the whips and scorns of time, the oppressor's wrong, the proud man's contumely, the pangs of dispriz'd love, the law's delay, the insolence of office, and the spurns that patient merit of the unworthy takes, when he himself might his quietus make with a bare bodkin?"
];

export default function SpeakWithMe() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const [speed, setSpeed] = useState(0.008);
  const [dimensions, setDimensions] = useState({ containerHeight: 0, contentHeight: 0 });
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const SPEED_OPTIONS = [
    { label: "Slow", value: 0.015, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { label: "Normal", value: 0.008, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { label: "Fast", value: 0.005, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { label: "Extreme", value: 0.0025, color: "bg-red-500/10 text-red-500 border-red-500/20" }
  ];

  useEffect(() => {
    setParagraph(PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
  }, []);

  // Robust measurement using ResizeObserver
  useEffect(() => {
    if (!hasStarted || isFinished || !containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    const observer = new ResizeObserver(() => {
      const cHeight = content.scrollHeight;
      const contHeight = container.offsetHeight;
      
      if (cHeight > 0 && contHeight > 0) {
        setDimensions({ containerHeight: contHeight, contentHeight: cHeight });
        setIsReady(true);
      }
    });

    observer.observe(content);
    observer.observe(container);

    return () => observer.disconnect();
  }, [hasStarted, isFinished, paragraph]);

  const handleStart = () => {
    setIsReady(false);
    setDimensions({ containerHeight: 0, contentHeight: 0 });
    setHasStarted(true);
    setIsFinished(false);
  };

  const handleReset = () => {
    setIsReady(false);
    setHasStarted(false);
    setIsFinished(false);
    setDimensions({ containerHeight: 0, contentHeight: 0 });
    setParagraph(PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10 max-w-5xl mx-auto w-full">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border-2 border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all font-bold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {!hasStarted && !isFinished && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-10 md:p-14 rounded-[2.5rem] border-primary/20 text-center flex flex-col items-center w-full shadow-2xl shadow-primary/5"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                <FastForward className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-8 italic tracking-tight">Speed Reading Challenge</h1>
              
              {/* Speed Selector */}
              <div className="w-full max-w-md mb-12">
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center">Select Challenge Speed</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SPEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSpeed(opt.value)}
                      className={`px-4 py-3 rounded-xl border font-bold transition-all ${
                        speed === opt.value 
                        ? `${opt.color.replace('/10', '/30')} border-opacity-100 scale-105 ring-2 ring-primary/20` 
                        : "bg-muted/50 border-border opacity-60 hover:opacity-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-12 py-6 rounded-[2rem] blue-gradient text-white font-black text-2xl flex items-center justify-center gap-4 hover:scale-105 transition-transform blue-glow"
              >
                <Play className="w-8 h-8 fill-current" />
                START NOW
              </button>
            </motion.div>
          )}

          {hasStarted && !isFinished && (
            <motion.div
              key="teleprompter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center h-[70vh] relative"
            >
              {/* Teleprompter Frame */}
              <div 
                ref={containerRef}
                className="w-full flex-1 relative overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-2xl"
              >
                {/* Gradient Fades */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-card to-transparent z-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none"></div>

                {/* Scrolling Text Container */}
                <div className="absolute inset-0 flex justify-center">
                  <motion.div
                    ref={contentRef}
                    key={`${paragraph}-${speed}`}
                    initial={{ y: 1000 }}
                    animate={isReady ? { y: -dimensions.contentHeight } : { y: dimensions.containerHeight || 1000 }}
                    transition={isReady ? {
                      duration: (dimensions.containerHeight + dimensions.contentHeight) * speed * 3.5,
                      ease: "linear",
                    } : { duration: 0 }}
                    onAnimationComplete={() => {
                      if (isReady) setIsFinished(true);
                    }}
                    className="w-full max-w-3xl px-8 text-center absolute top-0 opacity-80"
                  >
                    <p className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.5] text-foreground tracking-tight">
                      {paragraph}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={() => setIsFinished(true)}
                className="mt-8 px-8 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
              >
                <Square className="w-5 h-5 fill-current" />
                END CHALLENGE
              </button>
            </motion.div>
          )}

          {isFinished && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-10 md:p-14 rounded-[2.5rem] text-center flex flex-col items-center shadow-2xl"
            >
              <h2 className="text-4xl font-black mb-4 italic">Challenge Completed! 🎉</h2>
              <p className="text-xl text-muted-foreground mb-10">How did you do? Did you manage to keep up with the scrolling text without stumbling?</p>

              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-xl bg-muted font-bold text-foreground hover:bg-muted/80 transition-colors"
                >
                  Return to Dashboard
                </Link>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>
    </main>
  );
}
