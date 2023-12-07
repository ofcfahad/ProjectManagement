import { motion } from 'framer-motion'

export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <div style={{ width: '100%', height: '8px', backgroundColor: '', borderRadius: '8px' }}>
            <motion.div
                style={{ backgroundColor: '#734ae3', height: '8px', width: 0, borderRadius: '8px' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
            />
        </div>
    )
}
