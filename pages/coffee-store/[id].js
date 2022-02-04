import { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import cls from 'classnames';

import { defaultImage, fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import styles from '../../styles/coffee-store.module.css';
import { isEmpty } from '../../utils';

const CoffeeStore = (props) => {
  const router = useRouter();

  const {
    state: { coffeeStore },
  } = useContext(StoreContext);

  const [store, setStore] = useState([]);

  const id = router.query.id;

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      const findStoreById = coffeeStore.find(
        (store) => store.fsq_id.toString() === id
      );
      if (coffeeStore.length) setStore(findStoreById);
    } else {
      setStore(props.coffeeStore);
    }
  }, [id]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { address, neighborhood, name, imgUrl } = store;
  console.log(props);

  const handleUpVoteButton = () => {
    console.log('Up vote');
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>&#8592; Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || defaultImage}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
            objectFit='cover'
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src='/icons/places.svg'
              width='24'
              height='24'
              alt='address'
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood?.length && (
            <div className={styles.iconWrapper}>
              <Image
                src='/icons/nearMe.svg'
                width='24'
                height='24'
                alt='neighborhood'
              />
              <p className={styles.text}>{neighborhood[0]}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src='/icons/star.svg' width='24' height='24' alt='address' />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  console.log(coffeeStores);
  return {
    paths: coffeeStores.map((coffeeStore) => ({
      params: { id: coffeeStore.fsq_id.toString() },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStore:
        coffeeStores.find(
          (coffeeStore) => coffeeStore.fsq_id.toString() === params.id
        ) || {},
    },
  };
}

export default CoffeeStore;
