import React from 'react'
import styles from './modal.module.scss'
import Button from '../button/button'
import FocusTrap from 'focus-trap-react'
type ModalProps = {
  handleClose: () => void | void,
  children?: React.ReactNode | string,
  title: string,
  handleAction: () => void | void,
  actionText: string | React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ handleClose, children, title = '', handleAction, actionText = '' }) => {

  const handleKey = (e: any) => {
    if ([32, 13].includes(e.keyCode)) handleClose()
  }
  return (
    <div className={styles.wrapper}>
      <FocusTrap>
        <div className={styles.container}>
          <div className={styles.titleBar}>
            <div className={styles.title}>{title}</div>
            <div className={styles.close} onClick={() => handleClose()} onKeyUp={handleKey} tabIndex={0} role={'button'} aria-label={'close modal'}>
              <div />
              <div />
            </div>
          </div>
          {children}
          <Button className={'randomDog'} onClick={handleAction}>{actionText}</Button>
        </div>
      </FocusTrap>
    </div>
  )
}

export default Modal