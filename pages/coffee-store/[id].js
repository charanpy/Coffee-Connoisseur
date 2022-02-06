import { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import cls from 'classnames';

import { defaultImage, fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import styles from '../../styles/coffee-store.module.css';
import { isEmpty } from '../../utils';

const fetcher = (url) => fetch(url).then((r) => r.json());

const CoffeeStore = (props) => {
  const router = useRouter();

  const {
    state: { coffeeStore },
  } = useContext(StoreContext);

  const [store, setStore] = useState([]);

  const id = router.query.id;

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const {
        fsq_id: id,
        name,
        address,
        neighborhood,
        voting,
        imgUrl,
      } = coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `${id}`,
          name,
          address: address || '',
          neighborhood: neighborhood?.length ? neighborhood.join('') : '',
          voting,
          imgUrl,
        }),
      });

      const dbCoffeeStore = await response.json();
      return dbCoffeeStore;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!props.coffeeStore) return;
    if (isEmpty(props.coffeeStore)) {
      const findStoreById = coffeeStore.find(
        (store) => store.fsq_id.toString() === id
      );

      if (coffeeStore && findStoreById) {
        setStore(findStoreById);
        handleCreateCoffeeStore(findStoreById);
      }
    } else {
      setStore(props.coffeeStore);
      handleCreateCoffeeStore(props.coffeeStore);
    }
  }, [id, props, props.coffeeStore]);

  const [voting, setVoting] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data?.coffeeStore?.length) {
      setStore(data.coffeeStore[0]);
      setVoting(data.coffeeStore[0]?.voting || 0);
    }
  }, [id, JSON.stringify(data)]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { address, neighborhood, name, imgUrl } = store;

  const handleUpVoteButton = async () => {
    try {
      const response = await fetch(`/api/favoriteCoffeeStoreById?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore?.coffeeStore?.length) {
        setVoting((voting) => voting + 1);
      }
    } catch (error) {}
  };

  if (error) {
    return <div>Failed to fetch Coffee store</div>;
  }

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
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src='/icons/star.svg' width='24' height='24' alt='address' />
            <p className={styles.text}>{voting}</p>
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
