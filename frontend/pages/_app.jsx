import '../styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/nifes-logo.png" type="image/png" />
        <title>NIFES - Fellowship Attendance Dashboard</title>
      </Head>

      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/nifes-logo.png" alt="NIFES" className="h-8 w-auto mr-3" />
            <span className="font-semibold text-gray-900 dark:text-white">NIFES</span>
          </div>
          <div>
            <Link href="/admin" className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      <Component {...pageProps} />
    </>
  )
}
