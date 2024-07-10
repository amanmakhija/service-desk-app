import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { getUsers } from '../features/auth/authSlice'
import BackButton from '../components/BackButton'
import UserItem from '../components/UserItem'
import Spinner from '../components/Spinner'

function Admin() {
    const { allusers } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUsers()).unwrap().catch(toast.error)
    }, [dispatch])

    if (!allusers) {
        return <Spinner />
    }

    return (
        <>
            <BackButton />
            <h1>Users</h1>
            <div className='tickets'>
                <div className='ticket-headings'>
                    <div>Date</div>
                    <div>Name</div>
                    <div>Admin Status</div>
                    <div></div>
                </div>
                {allusers && allusers.map((user) => (
                    <UserItem key={user._id} user={user} />
                ))}
            </div>
        </>
    )
}

export default Admin