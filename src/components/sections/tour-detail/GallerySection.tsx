import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TourDetail } from '@/types/tours'
import ImageModal from '@/components/sections/tour-detail/ImageModal'

const images = [
  {
    id: 1,
    src: "https://picsum.photos/id/1036/600/400",
    // alt: "Luxury van interior with plush white leather seats"
  },
  {
    id:2,
    src: "https://picsum.photos/id/1043/600/400",
    // alt: "Luxury van interior with plush white leather seats"
  },
  {
    id:3,
    src: "https://picsum.photos/id/1038/600/400",
    // alt: "Luxury van interior with plush white leather seats"
  },
  {
    id:4,
    src: "/images/about.jpg",
  }, 
  {
    id:5,
    src: "/images/doi-cat-phuong-mai.jpg"
  },
  {
    id:6,
    src: "/images/eo-gio.jpg"
  }
];

function extractImageUrls(tourDestinations: TourDetail['tourDestinations']) {
    let id = 1;
    const imageGallery = tourDestinations.flatMap(destination =>
        destination.imageUrls.map(url => ({
            id: id++, // Gán ID duy nhất
            src: url
        }))
    );
    return imageGallery;
}


export default function GallerySection({data} :{data: TourDetail}) {
    const [showGallery, setShowGallery] = React.useState(false);
    const [selectedImageId, setSelectedImageId] = React.useState<number>();
    const imageGallery = extractImageUrls(data.tourDestinations);
    console.log(imageGallery)
    const handleShowGallery = () => {
        if(imageGallery.length > 0) {
            setSelectedImageId(imageGallery[0].id);
        }
        setShowGallery(true);
    }
    const handleCloseModal = () => {
        setShowGallery(false);
    }
  return (
    <div className="relative grid h-[450px] auto-rows-auto grid-cols-4 gap-1 md:grid-cols-12">
        {/* Large image - spans 8 columns on medium screens and up */}
        <Button
          variant="outline"
          size="lg"
          className="absolute bottom-4 right-4 z-10 border border-black"
          onClick={handleShowGallery}
        >
          Thư viện ảnh
        </Button>
        <Card className="col-span-4 row-span-2 overflow-hidden md:col-span-8">
          <CardContent className="h-full p-0">
            <div className="relative size-full">
              <Image
                src={images[0].src}
                alt="Luxury van interior with plush white leather seats"
                className="size-full object-cover object-center"
                width={500}
                height={500}
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* First small image - spans 4 columns on medium screens and up */}
        <Card className="col-span-4 overflow-hidden md:col-span-4">
          <CardContent className="h-full p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={images[2].src}
                alt="Luxury van interior with plush white leather seats"
                className="size-full object-cover object-center"
                width={400}
                height={400}
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Second small image - spans 4 columns on medium screens and up */}
        <Card className="col-span-4 overflow-hidden md:col-span-4">
          <CardContent className="relative h-full p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={images[1].src}
                alt="Luxury van interior with plush white leather seats"
                className="size-full object-cover"
                width={400}
                height={400}
                priority
              />
            </div>
          </CardContent>
        </Card>
        <ImageModal
        isOpen={showGallery}
        onClose={handleCloseModal}
        images={images}
        initialImageId={selectedImageId}
      />
      </div>
  )
}
