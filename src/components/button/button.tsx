import React from 'react'
import styles from './button.module.scss'


type ButtonProps = {
  onClick: () => void | void,
  className?: string | undefined,
  children: string | string[] | React.ReactNode
}
const Button: React.FC<ButtonProps> = ({ onClick, className, children }) => {

  return (
    <button
      className={`${styles.wrapper} ${styles[className ?? '']}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button