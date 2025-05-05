'use client'

import { JSX } from "react"

interface MenuLinkProps {
    label: string
    icon: React.ReactNode
    onClick: () => void
}

const MenuLink = ({ label, icon, onClick} : MenuLinkProps): JSX.Element => {
    return (
      <button
        onClick={onClick}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span className="mr-2 text-gray-500">{icon}</span>
        {label}
      </button>
    )
}

export default MenuLink;