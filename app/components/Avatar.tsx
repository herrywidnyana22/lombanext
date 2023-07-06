'use client'

import Image from "next/image"

interface AvatarProps{
    userImage?: string
    onClick?: () => void
}

const Avatar: React.FC<AvatarProps> = ({userImage, onClick}) => {
    return (
       <div 
            className="
                relative
                flex
                items-center
                w-10
                h-10
                cursor-pointer
                rounded-full
                overflow-hidden
                md:w-11
                md:h-11
            "
            onClick={onClick}
        >
            <Image
                src={userImage || '/images/placeholder_profile.png'}
                alt="Profile Image"
                fill
                sizes="40"
            />
        </div>
    )
}

export default Avatar