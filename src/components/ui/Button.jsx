import { cn } from '../../utils/cn' // Create later or use clsx
import { motion } from 'framer-motion'

const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const base = 'font-outfit font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
  const variants = {
    primary: 'bg-smit-blue text-white hover:bg-smit-blue/90 focus:ring-smit-blue',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    green: 'bg-smit-green text-white hover:bg-smit-green/90 focus:ring-smit-green',
    outline: 'border border-smit-blue text-smit-blue hover:bg-smit-blue hover:text-white',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      className={cn(base, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button

