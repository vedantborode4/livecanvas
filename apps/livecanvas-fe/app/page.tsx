export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            L
          </div>
          <span className="text-lg font-semibold">LiveCanvas</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#features" className="hover:text-black">Features</a>
          <a href="#collaboration" className="hover:text-black">Collaboration</a>
          <a href="#open-source" className="hover:text-black">Open Source</a>
        </nav>

        <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Open Canvas
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Draw. Think. Collaborate.
          <br />
          <span className="text-gray-500">In real time.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          LiveCanvas is a fast, multiplayer whiteboard inspired by Excalidraw —
          built for teams, classrooms, and solo thinking.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-800">
            Start Drawing
          </button>
          <button className="rounded-md border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50">
            View Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-6 py-20 max-w-7xl mx-auto"
      >
        <div className="grid md:grid-cols-3 gap-10">
          <Feature
            title="Infinite Canvas"
            description="Sketch freely on a limitless canvas with smooth pan and zoom."
          />
          <Feature
            title="Live Collaboration"
            description="See cursors, edits, and drawings update instantly."
          />
          <Feature
            title="Excalidraw-Style"
            description="Hand-drawn aesthetics with clean, readable diagrams."
          />
        </div>
      </section>

      {/* Collaboration Highlight */}
      <section
        id="collaboration"
        className="bg-gray-50 px-6 py-24"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Built for real-time teamwork
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Brainstorm, design, and explain ideas together — no installs required.
          </p>

          <div className="mt-10 rounded-xl border bg-white p-8 shadow-sm text-left">
            <ul className="space-y-4 text-gray-700">
              <li>• Multiplayer cursors</li>
              <li>• Instant sync using WebSockets</li>
              <li>• Shareable room links</li>
              <li>• Works on any device</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} LiveCanvas</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">GitHub</a>
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Feature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border p-6 hover:shadow-sm transition">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  )
}
