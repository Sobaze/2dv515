import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
const axios = require('axios')

import { useEffect, useState } from 'react'

import SearchResult from '../components/SearchResult'

export default function Home() {
  
  const [state, setState] = useState({
    searchQuery: '',
    result: [],
    searched: false,
    isScrapped: false
  })
  useEffect(() => {
    // So we dont scrape more pages on refresh of page
    if(localStorage.getItem('scraped') !== 'weScraped') {
      const scrap = async () => {
        const status = await axios.get(`/api/scrape`)
        console.log(status.status);
        console.log(state.isScrapped);
        localStorage.setItem('scraped', 'weScraped')
        if( status.status === 200) {
          setState((state) => {
            const tempState = {...state}
            tempState.isScrapped = true
            return tempState
          })
        }
        console.log(state.isScrapped);
      }
      if(state.isScrapped === false) {
        scrap()
      }
    }
  }, [state.isScrapped] )

  useEffect(() => {
    const getSearchQueries = async (e) => {
      
      const getSearchResult = await fetch(`/api/search?q=${state.searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      const links = await getSearchResult.json()
      if(state.searchQuery.length) {

        setState((state) => {
          const tempState = {...state}
          tempState.result = links
          tempState.searched = false
          return tempState
        })
      }
    }
    if(state.searchQuery !== '' && state.result !== '' && state.searched !== false ) {
      getSearchQueries()
    }
  }, [state.searchQuery, state.result, state.searched] )
  
  const handleSearch = (e) => {
    e.preventDefault()
    const quer = e.target.name.value 
    const tempState = {...state}
    tempState.searchQuery = quer
    tempState.searched = true
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
          <form onSubmit={handleSearch}>
            <p>Query: </p>
            <input type="text" name='name' ></input>
            <button type='submit' >Search!</button>
          </form>
          {state.result.length > 0 && state.searchQuery !== ''
          ? <SearchResult state={state} />
          : null
          }
        </div>
    </div>
  )
}
