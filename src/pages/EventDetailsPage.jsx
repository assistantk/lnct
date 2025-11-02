import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const EventDetailsPage = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://lnctworld.onrender.com/api/events/${id}`)
        const data = await res.json()

        if (data.success) {
          setEvent(data.data)
        } else {
          setError("Event not found.")
        }
      } catch (err) {
        console.error(err)
        setError("Error fetching event.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>{event.title}</h1>
      <img
        src={`https://lnctworld.onrender.com/api/event/image/${event.id}`}
        alt={event.title}
        style={{ width: "100%", height: "auto", marginBottom: "1rem" }}
      />
      <p>{event.description}</p>
    </div>
  )
}

export default EventDetailsPage
