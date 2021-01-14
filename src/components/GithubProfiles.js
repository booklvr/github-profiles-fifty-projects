import React, { Fragment, useState } from 'react'
import axios from 'axios'

const GithubProfiles = () => {
  const APIURL = 'https://api.github.com/users/'

  const [username, setUsername] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const [userRepo, setUserRepo] = useState(null)
  const [error, setError] = useState('')

  const getUser = async () => {
    try {
      const { data } = await axios(APIURL + username)
      setUserInfo(data)
      console.log('userInfo', userInfo)
    } catch (err) {
      if (err.response.status === 400) {
        setError('No profile with this username')
      }
    }
  }

  const getRepos = async () => {
    try {
      const { data } = await axios(APIURL + username + '/repos?sort=created')

      setUserRepo(data)
    } catch (err) {
      setError('Problem fetching Repos')
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    getRepos(username)
    getUser(username)
  }

  return (
    <Fragment>
      <form className='user-form' id='form' onSubmit={(e) => submitHandler(e)}>
        <input
          type='text'
          placeholder='Search a Github User'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </form>

      <main className='main'>
        {error && (
          <div className='card'>
            <h1>{error}</h1>
          </div>
        )}
        {userInfo && (
          <div className='card'>
            <div>
              <img
                src={userInfo.avatar_url}
                alt={userInfo.name}
                className='avatar'
              />
            </div>
            <div className='user-info'>
              <h2>{userInfo.name}</h2>
              <p>{userInfo.bio}</p>
              <ul>
                <li>
                  {userInfo.followers} <strong>Followers</strong>
                </li>
                <li>
                  {userInfo.following} <strong>Following</strong>
                </li>
                <li>
                  {userInfo.public_repos} <strong>Repos</strong>
                </li>
              </ul>
              <div className='repos'>
                {userRepo.length > 0 &&
                  userRepo.slice(0, 5).map((repo, index) => (
                    <a
                      key={index}
                      className='repo'
                      href={repo.html_url}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {repo.name}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </Fragment>
  )
}

export default GithubProfiles
