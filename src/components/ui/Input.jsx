import { cn } from '../../utils/cn'

const Input = ({ label, error, className, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700 font-outfit">
        {label}
      </label>
    )}
    <input
      className={cn(
        'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-smit-blue focus:border-transparent transition-all font-outfit',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
)

export default Input

