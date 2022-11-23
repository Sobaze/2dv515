import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'

import KmeanCluster from '../components/KmeanCluster'
import SelectClusterMethod from '../components/SelectClusterMethod'


export default function Home({clusters}) {

  const [state, setState] = useState({
      clusterOption: '',
      result: clusters,
      method: '',
      searched: false
  })

  useEffect(() => {
    const getKmeansSortedBlogs = async () => {
      const getKmeans = await fetch('/api/kmeanCluster', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const kMClust = await getKmeans.json()
      console.log(getKmeans)
      if(state.clusterOption == 'kmeans') {
        setState((state) => {
          const tempState = {...state}
          tempState.result = kMClust
          tempState.searched = false
          return tempState
        })
      }
    }
    if(state.clusterOption !== '' && state.method !== '' && state.result !== '' && state.searched !==false ) {
      getKmeansSortedBlogs()
    }
  }, [state.clusterOption, state.method, state.result, state.searched] )

  const handleCluster = () => {
    const clusterOpt = 'kmeans'
    const tempState = {...state}
    tempState.clusterOption = clusterOpt
    tempState.searched = true
    setState(tempState)
  }

  const handleSelectMethod = (e) => {
    const met = e.target.value
    console.log(met)
    const tempState = {...state}
    tempState.method = met
    setState(tempState)
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div>
        <SelectClusterMethod label="Cluster Method: " state={state} onSelectMethod={handleSelectMethod} ></SelectClusterMethod>
          <button onClick={handleCluster}>Get Clusters!</button>
        </div>

        {state.result.length > 0 && state.clusterOption === 'kmeans'
        ? <KmeanCluster state={state} />
        : null
        }
    </div>
  )
}


export async function getStaticProps() {
  const kMeansClusters = await fetch('http://localhost:3000/api/kmeanCluster')
  const clusters = await kMeansClusters.json()
  
  return {
    props: {
      clusters
    }
  }
}
