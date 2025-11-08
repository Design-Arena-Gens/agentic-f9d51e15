'use client'

import { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  description: string
  category: string
  region: string
  timestamp: string
  source: string
  severity: 'high' | 'medium' | 'low'
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data.events)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchEvents, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.category.toLowerCase() === filter.toLowerCase())

  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '40px',
          paddingTop: '20px'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
            🌍 World Events Agent
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Real-time monitoring of global events and news
          </p>
        </header>

        {/* Controls */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <button
            onClick={fetchEvents}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh Events'}
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '1rem' }}>Auto-refresh (30s)</span>
          </label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '2px solid #667eea',
              fontSize: '1rem',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <div style={{ marginLeft: 'auto', fontSize: '1rem', color: '#666' }}>
            {filteredEvents.length} events found
          </div>
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredEvents.map(event => (
            <div
              key={event.id}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              {/* Severity Indicator */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: event.severity === 'high' ? '#ef4444' :
                           event.severity === 'medium' ? '#f59e0b' : '#10b981'
              }} />

              {/* Category Badge */}
              <div style={{
                display: 'inline-block',
                background: '#667eea',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                {event.category}
              </div>

              {/* Title */}
              <h3 style={{
                margin: '10px 0',
                fontSize: '1.3rem',
                color: '#1a1a1a',
                lineHeight: '1.4'
              }}>
                {event.title}
              </h3>

              {/* Description */}
              <p style={{
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '10px 0'
              }}>
                {event.description}
              </p>

              {/* Meta Info */}
              <div style={{
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: '#999'
              }}>
                <span>📍 {event.region}</span>
                <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>

              <div style={{
                marginTop: '8px',
                fontSize: '0.85rem',
                color: '#999'
              }}>
                Source: {event.source}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && !loading && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ color: '#666', margin: 0 }}>No events found</h2>
            <p style={{ color: '#999', marginTop: '10px' }}>Try refreshing or changing the filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
