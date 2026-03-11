import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

import image1 from './images/rifath.png';
import image2 from './images/image.png';

const testimonialsData = [
  {
    quote: "MUSTAKIM'S architectural vision was very unique. He done our work before deadline with a better output what we expected.",
    author: "MD RIFATH",
    title: "Founder of Triple Bond ACEDEMY",
    avatar: image1,
  },
  {
    quote: "Working with MUSTAKIM was an absolute game-changer. His ability to translate complex ideas into preview is unparalleled.",
    author: "MD ABDULLAH",
    title: "Senior Developer, SULPHURIC BENCH",
    avatar: image2,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="min-h-screen bg-black relative z-10 py-24 md:py-48 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none text-white">
            What <span className="text-neon">They</span> Say.
          </h2>
          <p className="text-xl md:text-2xl font-light text-white/50 mt-4 max-w-2xl mx-auto">
            Insights from collaborators and industry leaders on the impact of my work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass p-8 md:p-12 rounded-3xl flex flex-col items-center text-center neon-glow"
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-24 h-24 rounded-full object-cover mb-6 border-2 border-neon/50"
              />
              <Quote className="text-neon mb-6" size={40} />
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="mt-8 border-t border-white/10 pt-6 w-full">
                <p className="text-white font-bold text-2xl uppercase tracking-wider">{testimonial.author}</p>
                <p className="text-neon text-lg">{testimonial.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
