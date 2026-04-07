import React, { useState, useEffect } from 'react';
import { Share, Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import admissionsImg from '../assets/admissions_2026.png';
import aiCourseImg from '../assets/ai_ml_course.png';
import successStoryImg from '../assets/student_success_stories.png';

const FBPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const demoPosts = [
      {
        id: 1,
        message: "🎉 Admissions Open for Web & Mobile Development Batch 2026! Last 50 seats remaining. Apply now at smitconnect.com/courses",
        created_time: "2 hours ago",
        reactions: 247,
        comments: 45,
        shares: 23,
        image: admissionsImg
      },
      {
        id: 2,
        message: "💻 New AI/ML course starting next month. 100% Free training by industry experts. Diploma certified.",
        created_time: "1 day ago",
        reactions: 389,
        comments: 67,
        shares: 41,
        image: aiCourseImg
      },
      {
        id: 3,
        message: "📚 500+ students placed in top companies this month! SMIT success stories continue...",
        created_time: "3 days ago",
        reactions: 612,
        comments: 89,
        shares: 156,
        image: successStoryImg
      }
    ];
    
    setTimeout(() => {
      setPosts(demoPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const fetchFBPosts = async () => {
    setError('FB credentials needed. Demo data shown.');
    // TODO: Graph API integration
  };

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-3xl p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500">Loading latest SMIT updates...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-3xl p-8 lg:p-12 shadow-lg border border-slate-100/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 rounded-2xl">
          <Share className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Latest from SMIT Facebook</h3>
          <p className="text-slate-500">
            Stay updated with admissions, events & success stories
            {error && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Setup needed
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl hover:shadow-blue-100/50 transition-all hover:-translate-y-1"
          >
            {post.image && (
              <div className="rounded-xl overflow-hidden mb-4 shadow-sm">
                <img src={post.image} alt="" className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
              </div>
            )}
            <p className="text-slate-800 leading-relaxed mb-4 line-clamp-3">{post.message}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{post.created_time}</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-slate-500">
                  <Heart size={16} /> {post.reactions}
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <MessageCircle size={16} /> {post.comments}
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Share2 size={16} /> {post.shares}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200 text-center">
        <button 
          onClick={fetchFBPosts}
          className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold border border-blue-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
        >
          Load More Posts
        </button>
      </div>
    </div>
  );
};

export default FBPosts;

