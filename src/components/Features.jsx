import React from 'react';
import { Code, Cpu, Smartphone, Layout, Rocket, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const courses = [
  {
    title: "Web Development",
    desc: "Master HTML, CSS, Javascript, and Modern Frameworks like React and Node.js.",
    icon: <Code size={32} />,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    title: "Artificial Intelligence",
    desc: "Deep dive into Machine Learning, Python, and Data Science fundamentals.",
    icon: <Cpu size={32} />,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600"
  },
  {
    title: "Mobile App Dev",
    desc: "Build cross-platform mobile apps for iOS and Android using Flutter & React Native.",
    icon: <Smartphone size={32} />,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    title: "UI/UX Design",
    desc: "Create stunning user interfaces and seamless user experiences with Figma.",
    icon: <Layout size={32} />,
    color: "bg-pink-500",
    lightColor: "bg-pink-50",
    textColor: "text-pink-600"
  },
  {
    title: "Cloud Computing",
    desc: "Learn to manage and deploy scalable applications using AWS and Azure.",
    icon: <Globe size={32} />,
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50",
    textColor: "text-cyan-600"
  },
  {
    title: "Cyber Security",
    desc: "Protect systems and networks from digital attacks and vulnerabilities.",
    icon: <Rocket size={32} />,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-slate-900 mb-6"
          >
            Explore Our <span className="text-smit-blue">Leading Courses</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg font-medium"
          >
            SMIT provides industry-standard training in various technology fields, helping you launch 
            a successful career in the global IT market.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-smit-blue/10 transition-all group"
            >
              <div className={`${course.lightColor} ${course.textColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {course.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{course.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium mb-8">
                {course.desc}
              </p>
              <button className={`${course.textColor} font-bold flex items-center gap-2 hover:gap-3 transition-all`}>
                Learn More <span>&rarr;</span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <button className="bg-smit-blue/5 text-smit-blue px-10 py-4 rounded-full font-bold text-lg hover:bg-smit-blue hover:text-white transition-all shadow-sm">
                View All Courses
            </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
