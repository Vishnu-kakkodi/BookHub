// import Image from "next/image";

// interface BookCardProps {
//   title: string;
//   isbn: string;
//   author: string;
//   imageUrl: string;
// }

// export default function BookCard({ title, isbn, author, imageUrl }: BookCardProps) {
//   return (
//     <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
//       <div className="relative h-48 w-full">
//         <Image
//           src={imageUrl || "/placeholder.svg"}
//           alt={title}
//           fill
//           style={{ objectFit: "cover" }}
//           className="rounded-t-lg"
//         />
//       </div>
//       <div className="px-6 py-4">
//         <div className="font-bold text-xl mb-2 text-gray-800">{title}</div>
//         <p className="text-gray-600 text-base mb-2">
//           <span className="font-semibold">Author:</span> {author}
//         </p>
//         <p className="text-gray-600 text-base">
//           <span className="font-semibold">ISBN:</span> {isbn}
//         </p>
//       </div>
//     </div>
//   );
// }


import React from 'react'

interface BookCardProps {
  title: string
  isbn: string
  author: string
  imageUrl: string
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  isbn,
  author,
  imageUrl,
}) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 w-full overflow-hidden group">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition duration-300">
            Quick View
          </button>
        </div>
      </div>
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2 text-gray-800 line-clamp-2 h-14">{title}</h2>
        <p className="text-gray-600 text-sm mb-2">
          by <span className="font-semibold">{author}</span>
        </p>
        <p className="text-gray-500 text-xs mb-4">ISBN: {isbn}</p>
      </div>
    </div>
  )
}

export default BookCard
