'use client'

import clsx from "clsx"

interface ButtonProps{
    type?: 'button' | 'submit' | undefined
    text?: any
    secondary?: boolean
    danger?: boolean
    disabled?: boolean
    icon?: any
    className?: string
    onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
    type,
    icon: Icon,
    text,
    onClick,
    secondary,
    danger,
    disabled,
    className
}) => {

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(`
        flex
        gap-2
        justify-center
        items-center
        mt-3
        px-3
        py-2
        text-sm
        rounded-md
        font-semibold
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2`,
        className,
        disabled && "opacity-60 cursor-not-allowed",
        secondary ? "text-gray-900" : "text-white",
        danger && "bg-rose-500 hover:bg-rose-400 focus-visible:outline-rose-600",
        !secondary && !danger && "bg-indigo-500 hover:bg-indigo-600 focus-visible:outline-indigo-600"
      )}
  >
      {
        <Icon className="w-4 h-4 shrink-0 "/>
      }
        {text}
    </button>
  )
}

export default Button