import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { FaPlus } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { getTicket, closeTicket, updateTicket } from '../features/tickets/ticketSlice'
import { getNotes, createNote } from '../features/notes/noteSlice'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import { getAdmins } from '../features/auth/authSlice'

const customStyles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
  },
}

Modal.setAppElement('#root')

function Ticket() {
  const { user } = useSelector((state) => state.auth)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const isStaff = user.isAdmin
  const staffId = isStaff ? user._id : ''
  const { ticket } = useSelector((state) => state.tickets)
  const { admins } = useSelector((state) => state.auth)
  const { notes } = useSelector((state) => state.notes)
  const [assignedUser, setAssignedUser] = useState('select')

  // NOTE: no need for two useParams
  // const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { ticketId } = useParams()

  useEffect(() => {
    dispatch(getTicket(ticketId)).unwrap().catch(toast.error)
    dispatch(getNotes(ticketId)).unwrap().catch(toast.error)
    dispatch(getAdmins()).unwrap().catch(toast.error)
  }, [ticketId, dispatch])

  useEffect(() => {
    ticket && setAssignedUser(ticket.assigned || 'select')
  }, [ticket])

  // Close ticket
  const onTicketClose = () => {
    // NOTE: we can unwrap our AsyncThunkACtion here so no need for isError and
    // isSuccess state
    const closingUser = user._id
    const closedByUser = user.name
    dispatch(closeTicket({ ticketId, closingUser, closedByUser }))
      .unwrap()
      .then(() => {
        toast.success('Ticket Closed')
        navigate('/tickets')
      })
      .catch(toast.error)
  }

  // Create note submit
  const onNoteSubmit = (e) => {
    // NOTE: we can unwrap our AsyncThunkACtion here so no need for isError and
    // isSuccess state
    e.preventDefault()
    dispatch(createNote({ noteText, ticketId, isStaff, staffId }))
      .unwrap()
      .then((res) => {
        setNoteText('')
        closeModal()
      })
      .catch(toast.error)
  }

  const assignUser = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const assigneduser = e.target.value;
    const assignedName = selectedOption.text;
    setAssignedUser(assigneduser)

    if (assignedUser !== 'select') {
      dispatch(updateTicket({ ticketId, assignedUser: assigneduser, assignedName }))
        .unwrap()
        .catch(toast.error)
      dispatch(getTicket(ticketId)).unwrap().catch(toast.error)
    }
  }

  // Open/close modal
  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (!ticket) {
    return <Spinner />
  }

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <BackButton />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <h3>Priority: {ticket.priority}</h3>
        <h3>Assigned Staff: {user.isAdmin ? (
          ticket.status !== 'closed' && (user.isSuperAdmin || !ticket.assigned) ?
            <select className='dropdown' value={assignedUser} onChange={assignUser}>
              <option value='select'>Select User</option>
              {user.isSuperAdmin ? admins && (
                admins.map((admin) => <option key={admin._id} value={admin._id}>{admin.name}</option>)
              ) : <option value={user._id}>{user.name}</option>}
            </select> : <span>{ticket.assignedName}</span>
        ) : !ticket.assigned ? <span>None</span> : <span>{ticket.assignedName}</span>}</h3>
        {ticket.status === 'closed' && (
          <h3>Closed By: {ticket.closedByUser}</h3>
        )}
        <hr />
        <div className='ticket-desc'>
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {(ticket.status !== 'closed' && (user.isSuperAdmin || user._id === ticket.user || user._id === ticket.assigned)) && (
        <button onClick={openModal} className='btn'>
          <FaPlus /> Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Add Note'
      >
        <h2>Add Note</h2>
        <button className='btn-close' onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className='form-group'>
            <textarea
              name='noteText'
              id='noteText'
              className='form-control'
              placeholder='Note text'
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className='form-group'>
            <button className='btn' type='submit'>
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notes ? (
        notes.map((note) => <NoteItem key={note._id} note={note} />)
      ) : (
        <Spinner />
      )}

      {ticket.status !== 'closed' && (
        <button onClick={onTicketClose} className='btn btn-block btn-danger'>
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket
