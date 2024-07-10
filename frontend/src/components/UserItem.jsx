import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { demote } from '../features/auth/authSlice'
import { toast } from 'react-toastify'

function UserItem({ user }) {
    const dispatch = useDispatch()

    // Demote admin
    const onDemote = (e) => {
        // NOTE: we can unwrap our AsyncThunkACtion here so no need for isError and
        // isSuccess state
        e.preventDefault()
        const adminId = user._id
        dispatch(demote(adminId))
            .unwrap()
            .then((res) => {
                toast.success(`${user.isAdmin ? 'Admin' : 'User'} '${user.name}' ${user.isAdmin ? 'demoted' : 'promoted'} successfully`)
            })
            .catch(toast.error)
    }

    return (
        <div className='ticket'>
            <div>{new Date(user.updatedAt).toLocaleString('en-US')}</div>
            <div>{user.name}</div>
            <div className={`status`}>{user.isAdmin ? user.isSuperAdmin ? <span>Super Admin</span> : <span>Admin</span> : <span>User</span>}</div>
            <Link to='/admin' className='btn btn-reverse btn-sm' onClick={onDemote}>
                {user.isAdmin ? user.isSuperAdmin ? <span>Cannot Demote</span> : <span>Demote</span> : <span>Promote</span>}
            </Link>
        </div>
    )
}

export default UserItem