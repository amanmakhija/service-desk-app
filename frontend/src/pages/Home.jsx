import { Link } from 'react-router-dom'
import { FaQuestionCircle, FaTicketAlt, FaCrown } from 'react-icons/fa'
import { useSelector } from 'react-redux'

function Home() {
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <section className='heading'>
        <h1>What do you need help with?</h1>
        <p>Please choose from an option below</p>
      </section>

      {user && user.isAdmin ? user.isSuperAdmin && <Link to='/admin' className='btn btn-reverse btn-block'>
        <FaCrown /> Admin Panel
      </Link> : <Link to='/new-ticket' className='btn btn-reverse btn-block'>
        <FaQuestionCircle /> Create New Ticket
      </Link>}

      <Link to='/tickets' className='btn btn-block'>
        <FaTicketAlt /> {user && user.isAdmin ? <span>View All Tickets</span> : <span>View My Tickets</span>}
      </Link>
    </>
  )
}

export default Home
