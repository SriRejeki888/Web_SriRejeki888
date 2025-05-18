import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

const Categories = () => {
  return (
    <div className="flex items-center">
      <Link href="/admin" passHref>
        <button className="flex items-center text-gray-600 hover:text-[var(--primary-color)] mr-4">
          <FiArrowLeft className="mr-2" /> Kembali
        </button>
      </Link>
      <h1 className="text-xl font-bold text-[var(--primary-color)]">
        Kelola Kategori
      </h1>
    </div>
  )
}

export default Categories 