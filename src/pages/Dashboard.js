import TinderCard from 'react-tinder-card'
import { useEffect, useState } from 'react'
import ChatContainer from '../components/ChatContainer'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
  console.log('Page Loaded');

    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
            })
            console.log("User data fetched:", response.data)
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getGenderedUsers = async () => {
        try {
            if (user) {
                const response = await axios.get('http://localhost:8000/gendered-users', {
                    params: { gender: user.gender_interest }
                })
                console.log("Gendered users fetched:", response.data)
                setGenderedUsers(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log("Fetching user data")
        getUser()
    }, [])

    useEffect(() => {
        if (user) {
            console.log("Fetching gendered users")
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            console.log("Match updated")
            getUser()
        } catch (err) {
            console.log(err)
        }
    }

    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        console.log("Swiped:", direction)
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId) || []
    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))

    console.log('filteredGenderedUsers ', filteredGenderedUsers)

    return (
        <>
            hi
            {user &&
                <div className="dashboard">
                    hi inside user check
                    <ChatContainer user={user} />
                    hi inside ChatContainer
                    <div className="swipe-container">
                        hi inside swipe-container
                        <div className="card-container">
                            hi inside card-container

                            {filteredGenderedUsers?.map((genderedUser) =>
                                <TinderCard
                                    className="swipe"
                                    key={genderedUser.user_id}
                                    onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                    onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                                    <div
                                        style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
                                        className="card">
                                        <h3>{genderedUser.first_name}</h3>
                                    </div>
                                </TinderCard>
                            )}
                            <div className="swipe-info">
                                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}
export default Dashboard;
