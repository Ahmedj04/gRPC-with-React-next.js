import Image from 'next/image'
import { Inter } from 'next/font/google'
import ChatBot from '../components/ChatBot'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <ChatBot />
    </main>
    
  )
}
