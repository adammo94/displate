import React, { useEffect, useState, useMemo } from 'react'
import styles from './home.module.scss'
import Modal from '../modal/modal'
import Button from '../button/button'

import paw from '../../assets/images/paw.svg'
import Head from '../head/head'

const Home = () => {
  const [breedList, setBreedList] = useState([] as any)
  const [currentBreed, setCurrentBreed] = useState('')
  const [currentSubBreed, setCurrentSubBreed] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDog, setCurrentDog] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dogFetchError, setDogFetchError] = useState(false)
  const [listFetchError, setListFetchError] = useState(false)

  const getAllBreeds = async () => {
    setIsLoading(true)
    return fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(data => {
        const allBreeds = data.message
        setBreedList(Object.keys(allBreeds)
          .map(masterBreedItem => allBreeds[masterBreedItem].length > 0
            ? allBreeds[masterBreedItem].map((subBreedItem: string) => [subBreedItem, masterBreedItem])
            : masterBreedItem
          ).flat())
      })
      .catch(err => setListFetchError(true))
  }

  const breedSet = (masterBreed: string, subBreed?: string) => {
    if (masterBreed) setCurrentBreed(masterBreed)
    if (subBreed) { setCurrentSubBreed(subBreed) } else setCurrentSubBreed('')
    if (masterBreed === currentBreed && (subBreed === currentSubBreed || subBreed === undefined)) getNewDog()
  }

  const getDogUrl: any = () => {
    if (!currentBreed && !currentSubBreed) return 'https://dog.ceo/api/breeds/image/random'
    if (currentBreed && !currentSubBreed) return `https://dog.ceo/api/breed/${currentBreed}/images/random`
    if (currentBreed && currentSubBreed) return `https://dog.ceo/api/breed/${currentBreed}/${currentSubBreed}/images/random`
  }

  const getNewDog = async () => {
    setIsLoading(true)
    const url = getDogUrl()
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        setCurrentDog(data.message);
        if (data.message === currentDog) { setIsLoading(false) } setModalOpen(true);
      })
      .catch(err => {
        setIsLoading(false)
        setDogFetchError(true)
      })
  }

  const getTitle = useMemo(() => {
    if (!currentBreed && !currentSubBreed) return 'totally random doggo'
    return `${currentBreed || ''} ${currentSubBreed || ''}`
  }, [currentSubBreed, currentBreed])

  useEffect(() => { getAllBreeds() }, [])

  useEffect(() => { currentBreed && getNewDog() }, [currentSubBreed, currentBreed])

  useEffect(() => {
    if (modalOpen) document.body.style.overflow = 'hidden'
    if (!modalOpen) document.body.style.overflow = 'unset'
  }, [modalOpen])


  return (
    <main className={styles.wrapper}>
      <Head />
      <div className={styles.container}>
        <div className={styles.leftWrapper}>
          <div className={styles.leftContainer}>
            <img src={paw} className={styles.paw} alt='paw icon' width={64} height={64} />
            <div className={styles.separator} />
            <h1>Random Dog Photo Fetch App</h1>
            <h2>This app let's you randomly fetch doggos' photos straight outta dogNet</h2>
            <div className={styles.separator} />
          </div>
        </div>
        <div className={styles.breedList}>
          {
            breedList.length >= 0 && listFetchError === false
              ? breedList.map((breed: string[] | string) => Array.isArray(breed)
                ? <Button className={'breedButton'} key={`${breed[0]}${breed[1]}`} onClick={() => breedSet(breed[1], breed[0])}>{breed[0]} {breed[1]}</Button>
                : <Button className={'breedButton'} key={breed} onClick={() => breedSet(breed)}>{breed}</Button>)
              : listFetchError === false
                ? <p>Dog breeds' list is loading, please wait...</p>
                : <p>Server error, try reloading</p>
          }
        </div>
        {modalOpen &&
          <Modal
            title={getTitle}
            handleClose={() => setModalOpen(false)}
            handleAction={getNewDog}
            actionText={<>Draw new doggo <span role='img' aria-label='die emoji'>🎲</span></>}
          >
            <img
              src={currentDog}
              className={styles.modalImg}
              alt={`${currentBreed || ''} ${currentSubBreed || ''} random dog`}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && !dogFetchError && <div className={styles.modalLoading}>loading...</div>}
            {dogFetchError && <div className={styles.modalLoading}>Server error, try reloading</div>}
          </Modal>}
      </div>
    </main >
  )
}

export default Home