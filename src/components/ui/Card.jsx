import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const Card = ({ children, className, hoverEffect = true, ...props }) => (
  <motion.div
    className={cn(
      'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden',
      className
    )}
    whileHover={hoverEffect ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : false}
    {...props}
  >
    {children}
  </motion.div>
)

export default Card

