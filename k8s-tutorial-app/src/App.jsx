import { useMemo, useState } from 'react'
import { tutorialSections } from './contentData'
import './index.css'

function App() {
  const [activeSectionId, setActiveSectionId] = useState(tutorialSections[0].id)

  const activeSection = useMemo(
    () => tutorialSections.find((section) => section.id === activeSectionId),
    [activeSectionId],
  )

  const [activeConceptId, setActiveConceptId] = useState(
    tutorialSections[0].concepts[0].id,
  )

  const activeConcept = useMemo(
    () =>
      activeSection.concepts.find((concept) => concept.id === activeConceptId) ||
      activeSection.concepts[0],
    [activeConceptId, activeSection],
  )

  const parsedNotes = useMemo(() => parseNotes(activeConcept.notesRaw), [activeConcept])

  const [progressOpen, setProgressOpen] = useState(false)
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem('ckad-progress')
      return new Set(stored ? JSON.parse(stored) : [])
    } catch {
      return new Set()
    }
  })

  function toggleCompleted(conceptId) {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(conceptId)) {
        next.delete(conceptId)
      } else {
        next.add(conceptId)
      }
      try {
        localStorage.setItem('ckad-progress', JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  function onSelectSection(sectionId) {
    const section = tutorialSections.find((item) => item.id === sectionId)
    setActiveSectionId(sectionId)
    setActiveConceptId(section.concepts[0].id)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">CKAD Preparation</p>
        <h1>Kubernetes Tutorial</h1>
        <p className="subtitle">
          Navigate through CKAD topics, read concise explanations, and inspect
          real YAML manifests from this repository.
        </p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h2>Sections</h2>
          <div className="section-list">
            {tutorialSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={
                  section.id === activeSectionId
                    ? 'section-button active'
                    : 'section-button'
                }
                onClick={() => onSelectSection(section.id)}
              >
                <span>{section.label}</span>
                <small>{section.concepts.length} concepts</small>
              </button>
            ))}
          </div>
        </aside>

        <main className="content">
          <section className="concept-tabs">
            {activeSection.concepts.map((concept) => (
              <button
                key={concept.id}
                type="button"
                className={
                  concept.id === activeConcept.id ? 'tab active' : 'tab'
                }
                onClick={() => setActiveConceptId(concept.id)}
              >
                {concept.title}
              </button>
            ))}
          </section>

          <section className="card animate-in">
            <h2>{activeConcept.title}</h2>
            <p className="what-is">{renderInlineMarkdown(parsedNotes.whatIsIt)}</p>
          </section>

          <section className="card animate-in delay-1">
            <h3>Key Characteristics</h3>
            <ul>
              {parsedNotes.keyCharacteristics.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          </section>

          <section className="card animate-in delay-2">
            <h3>Commands</h3>
            <pre>
              <code>{parsedNotes.commands}</code>
            </pre>
          </section>

          <section className="card animate-in delay-3">
            <h3>{activeConcept.examples ? 'YAML Examples' : 'Example YAML'}</h3>
            {activeConcept.examples ? (
              <div className="yaml-examples">
                {activeConcept.examples.map((example) => (
                  <div key={example.title} className="yaml-example-item">
                    <h4>{example.title}</h4>
                    <p className="yaml-path">{example.summary}</p>
                    <pre>
                      <code>{example.yamlRaw}</code>
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="yaml-path">{activeConcept.exampleSummary}</p>
                <pre>
                  <code>{activeConcept.yamlRaw}</code>
                </pre>
              </>
            )}
          </section>
        </main>
      </div>

      <button
        type="button"
        className="progress-fab"
        onClick={() => setProgressOpen((o) => !o)}
        aria-label="Toggle progress tracker"
      >
        {progressOpen ? '✕' : '📋'}
      </button>

      {progressOpen && (
        <div className="progress-backdrop" onClick={() => setProgressOpen(false)} />
      )}

      <div className={progressOpen ? 'progress-drawer open' : 'progress-drawer'}>
        <div className="progress-drawer-header">
          <h2>Progress Tracker</h2>
          <button
            type="button"
            className="progress-drawer-close"
            onClick={() => setProgressOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="progress-drawer-body">
          <ProgressTracker
            sections={tutorialSections}
            completed={completed}
            onToggle={toggleCompleted}
          />
        </div>
      </div>
    </div>
  )
}

function CircleRing({ done, total }) {
  const r = 14
  const circumference = 2 * Math.PI * r
  const pct = total ? done / total : 0
  const offset = circumference * (1 - pct)
  const allDone = total > 0 && done === total
  return (
    <svg className="ring-svg" viewBox="0 0 36 36" width="36" height="36">
      <circle cx="18" cy="18" r={r} className="ring-track" />
      <circle
        cx="18"
        cy="18"
        r={r}
        className="ring-fill"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          stroke: allDone ? 'var(--ring-done)' : 'var(--primary)',
        }}
      />
      <text x="18" y="22" className="ring-text">{done}/{total}</text>
    </svg>
  )
}

function countItems(practice) {
  return practice.reduce((sum, p) => sum + (p.children ? p.children.length : 1), 0)
}

function countDone(practice, completed) {
  return practice.reduce((sum, p) =>
    sum + (p.children
      ? p.children.filter((c) => completed.has(c.id)).length
      : completed.has(p.id) ? 1 : 0), 0)
}

function PracticeSubGroup({ item, completed, onToggle }) {
  const [open, setOpen] = useState(false)
  const done = item.children.filter((c) => completed.has(c.id)).length
  const total = item.children.length
  const allDone = done === total
  return (
    <li className="progress-item practice-subgroup">
      <button
        type="button"
        className="practice-subgroup-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={allDone ? 'progress-topic done' : 'progress-topic'}>{item.title}</span>
        <span className="practice-subgroup-meta">
          <span className="practice-subgroup-count">{done}/{total}</span>
          <span className="progress-concept-chevron">{open ? '▲' : '▼'}</span>
        </span>
      </button>
      {open && (
        <ul className="progress-checklist progress-sub-checklist practice-sub-sub-checklist">
          {item.children.map((child) => (
            <li key={child.id} className="progress-item">
              <label className="progress-label">
                <input
                  type="checkbox"
                  checked={completed.has(child.id)}
                  onChange={() => onToggle(child.id)}
                />
                <span className={completed.has(child.id) ? 'progress-topic done' : 'progress-topic'}>
                  {child.title}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function ConceptGroup({ concept, completed, onToggle }) {
  const [open, setOpen] = useState(false)
  const done = countDone(concept.practice, completed)
  const total = countItems(concept.practice)
  const allDone = total > 0 && done === total
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <li className="progress-concept-group">
      <button
        type="button"
        className="progress-concept-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={allDone ? 'progress-concept-title complete' : 'progress-concept-title'}>
          {concept.title}
        </span>
        <span className="progress-concept-meta">
          <span className="progress-concept-pct">{pct}%</span>
          <CircleRing done={done} total={total} />
          <span className="progress-concept-chevron">{open ? '▲' : '▼'}</span>
        </span>
      </button>
      {open && (
        <ul className="progress-checklist progress-sub-checklist">
          {concept.practice.map((item) =>
            item.children ? (
              <PracticeSubGroup
                key={item.id}
                item={item}
                completed={completed}
                onToggle={onToggle}
              />
            ) : (
              <li key={item.id} className="progress-item">
                <label className="progress-label">
                  <input
                    type="checkbox"
                    checked={completed.has(item.id)}
                    onChange={() => onToggle(item.id)}
                  />
                  <span className={completed.has(item.id) ? 'progress-topic done' : 'progress-topic'}>
                    {item.title}
                  </span>
                </label>
              </li>
            )
          )}
        </ul>
      )}
    </li>
  )
}

function ProgressTracker({ sections, completed, onToggle }) {
  const totalItems = sections.reduce((sum, s) =>
    sum + s.concepts.reduce((cs, c) => cs + (c.practice ? countItems(c.practice) : 1), 0), 0)
  const completedCount = sections.reduce((sum, s) =>
    sum + s.concepts.reduce((cs, c) =>
      cs + (c.practice
        ? countDone(c.practice, completed)
        : completed.has(c.id) ? 1 : 0), 0), 0)
  const pct = totalItems ? Math.round((completedCount / totalItems) * 100) : 0

  return (
    <div className="progress-tracker">
      <div className="progress-overview">
        <p className="progress-overview-count">
          {completedCount} of {totalItems} items completed ({pct}%)
        </p>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {sections.map((section, si) => {
        const sectionTotal = section.concepts.reduce((cs, c) => cs + (c.practice ? countItems(c.practice) : 1), 0)
        const sectionDone = section.concepts.reduce((cs, c) =>
          cs + (c.practice
            ? countDone(c.practice, completed)
            : completed.has(c.id) ? 1 : 0), 0)
        return (
          <div
            key={section.id}
            className="progress-section animate-in"
            style={{ animationDelay: `${(si + 1) * 60}ms` }}
          >
            <div className="progress-section-header">
              <h3>{section.label}</h3>
              <span className="progress-badge">
                {sectionDone}/{sectionTotal}
              </span>
            </div>
            <ul className="progress-checklist">
              {section.concepts.map((concept) =>
                concept.practice ? (
                  <ConceptGroup
                    key={concept.id}
                    concept={concept}
                    completed={completed}
                    onToggle={onToggle}
                  />
                ) : (
                  <li key={concept.id} className="progress-item">
                    <label className="progress-label">
                      <input
                        type="checkbox"
                        checked={completed.has(concept.id)}
                        onChange={() => onToggle(concept.id)}
                      />
                      <span className={completed.has(concept.id) ? 'progress-topic done' : 'progress-topic'}>
                        {concept.title}
                      </span>
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function parseNotes(markdownText) {
  const normalized = markdownText.replace(/\r\n/g, '\n')

  const whatIsMatch = normalized.match(
    /## What is it\?\n([\s\S]*?)(\n## |$)/,
  )
  const keyCharacteristicsMatch = normalized.match(
    /## Key Characteristics\n([\s\S]*?)(\n## |$)/,
  )
  const commandsMatch = normalized.match(
    /## Commands\s*\n```(?:kubectl)?\n([\s\S]*?)\n```/,
  )

  const whatIsIt = whatIsMatch
    ? whatIsMatch[1].trim().replace(/\n+/g, ' ')
    : 'Definition not available.'

  const keyCharacteristics = keyCharacteristicsMatch
    ? keyCharacteristicsMatch[1]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('-'))
        .map((line) => line.replace(/^-\s*/, ''))
    : []

  const commands = commandsMatch
    ? commandsMatch[1].trim()
    : 'No commands found for this concept.'

  return { whatIsIt, keyCharacteristics, commands }
}

function renderInlineMarkdown(text) {
  const inlinePattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  const parts = text.split(inlinePattern).filter(Boolean)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`inline-${index}`}>{part.slice(2, -2)}</strong>
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`inline-${index}`}>{part.slice(1, -1)}</code>
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={`inline-${index}`}>{part.slice(1, -1)}</em>
    }

    return <span key={`inline-${index}`}>{part}</span>
  })
}

export default App
