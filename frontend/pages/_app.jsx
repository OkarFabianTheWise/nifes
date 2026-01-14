import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/nifes-logo.png" type="image/png" />
        <title>NIFES - Fellowship Attendance Dashboard</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
